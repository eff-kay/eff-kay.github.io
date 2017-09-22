+++
date = "2017-03-12T11:55:50+08:00"
title = "C keywords: Don't flame out over volatile"
author = "Best Author Ever"

+++

faizan khan - August 05, 2016
*originally published in published in [embedded.com](http://www.embedded.com/design/programming-languages-and-tools/4442490/C-keywords--Don-t-flame-out-over-volatile) .Selected as the [best design article of 2016](http://www.embedded.com/electronics-blogs/say-what-/4443190/Top-Embedded-articles-in-2016-) by the editors.*

Consider the following code,


    struct _a_struct{
        int x;
        int y
        volatile bool alive=false;
    } ASTRUCT;

    ASTRUCT a_struct;

    //Thread 1
    a_struct.x = x;
    a_struct.y = y;
    a_struct.alive =true;

    //thread 2
    if (a_struct.alive==true)
    {
        draw_struct(a_struct.x, a_struct.y);
    }

This is a normal scenario of an object being shared between two threads, one thread is updating its value and the other is waiting for the updated values. The above code seems harmless but there is something wrong with it. It will not produce the [desired results](https://msdn.microsoft.com/en-us/library/windows/desktop/ee418650). We could try to make everything in the structure volatile but this would produce inefficient code. We don’t want to lose efficiency; we just want to share data between the two threads. In this article, I will show you what problems can be caused by the above code, and why should we avoid the solution of placing volatile with everything.

This article will have two parts. The first part will try to resolve all the confusion surrounding volatile. We will discuss its semantics: declaration and assignments, its use in a multi-threaded environment and its use in a kernel setting. The second part will lay out use cases where volatile is considered necessary like in a setjmp and longjmp, signal handling and inline assembly.

My motivation for writing this article is to make some sense of the chaos surrounding volatile. I wanted this article to be a complete guide for the use of volatile. But from what I have researched, it’s not that we don’t know how to use this keyword, it’s just that we don’t know when to stop using it. The basic use cases, which are as follows, [are well known](https://barrgroup.com/Embedded-Systems/How-To/C-Volatile-Keyword).

1. Use volatile on memory mapped IO
2. Use volatile on global data shared between multiple tasks
3. Use volatile on data used in ISR.

A lot has been written on them, and it is because of this reiteration of these basic use cases that we tend to start using volatile everywhere. All of the code I see seems to lie in one of the above categories. For example I was faced with a problem related to global data accessed in an ISR. I placed volatile with everything I thought could cause the problem and the code worked fine. But as we will see later, this solution hid the problem as opposed to solving it. Naturally an issue was reported after a few months regarding loss of data synchronization.

### The Setting
The [second edition](http://www.embedded.com/design/programming-languages-and-tools/4442490/1/K&R%2520Dennis%2520Ritchie) of K&R introduced volatile as follows.


> "The purpose of volatile is to force an implementation to suppress optimization that could otherwise occur. For example, for a machine with memory-mapped input/output, a pointer to a device register might be declared as a pointer to volatile, in order to prevent the compiler from removing apparently redundant references through the pointer." — Dennis Ritchie.

Volatile was introduced to inform the compiler of special memory mapped regions. There is a [usenet group post](https://groups.google.com/forum/#!msg/comp.std.c/tHvQhiKFtD4/zfIgJhbkCXcJ) that says that before volatile, compilers had to use strange heuristics to identify which regions were memory mapped and which were not. So volatile was a necessary addition to the C language at the time. But beyond this basic use case, [volatile is widely misused](https://blog.regehr.org/archives/28).

Back in those days most processors were single core and executed the instructions [in-order](https://courses.cs.washington.edu/courses/csep548/06au/lectures/introOOO.pdf). What you wrote and the order you wrote it in got executed without a scratch. Nowadays the code that we write, known as abstract machine by the C standard, is a lot different from the actual implementation that gets executed. In fact according to the C standard the only thing the compiler has to make sure to produce executable code is the end result.

The only thing the compiler cannot do is remove or reorder accesses to volatile qualified objects ([C-99 rationale](http://www.open-std.org/jtc1/sc22/wg14/www/C99RationaleV5.10.pdf)). But it can freely remove or reorder non-volatile accesses around it. The compiler can also upgrade some objects to become volatile qualified after certain expressions. Therefore [understanding the usage of volatile](http://www.embedded.com/design/programming-languages-and-tools/4415475/Guidelines-for-handling-volatile-variables) in basic use cases like declarations and assignments is also necessary. Some developers still struggle to differentiate between a volatile object and a volatile pointer. In the next section I will start with addressing these points of confusions one by one. They are arranged in order of their increasing confusion regarding the usage of volatile.

### SEMANTICS

#### Declarations
Lets start with the basics.

    int* pi; // is a pointer to an int.


    int volatile* pvi; // is a pointer to a volatile int; meaning the object it is pointing to, is volatile

    int* volatile vpi; // is a volatile pointer to an int; pointer is volatile, the object it is pointing to is an int. This is of fairly less use.

    int volatile* volatile vpvi; // volatile pointer to a volatile int; both the pointer and the memory location it is pointing to, are volatile int.

As a general rule of thumb, when reading complex declarations the rule is to start reading from the right and go all the way to the left. This rule is helpful in other declarations as well. The rule is also one of the reasons you should [put qualifiers to the right](http://www.embedded.com/electronics-blogs/programming-pointers/4025609/Place-volatile-accurately.) of the type it is qualifying.

> The logic for deciding such semantics of declarations was that it should correspond to its use in expressions. Thus *pi, when used in an expression would yield an int, and *pvi when used in an expression would yield a volatile int. --- Dennis Ritchie, [The Development of C Language](https://www.bell-labs.com/usr/dmr/www/chist.html)


#### Complex Objects
You can declare a volatile struct as

```
struct volatile _a
{
    int mem_i;
    int* pmem_i;
} A;
```
Thus every A and its members from now on will be volatile.

> CHECKPOINT: In C, if a collective is volatile then all its members are volatile.


Consider the code

```
A a_struct; //a_struct is volatile
```

What about its members

```
a_struct.mem_i ; // the type is volatile int
```
```
a_struct.pmem_i; // the type is, wait for it, int* volatile
(the pointer is volatile not the object it is pointing to)
```
The second line is a very important point to keep in mind when declaring structs. Since the pointer is volatile but the object it is pointing to is an int, all accesses to int can be optimized out. This introduces a lot of problems in conversions, and if you are unlucky you might not get any warnings by the compiler at all.

> CHECKPOINT: When using volatile on a collective such as structs, volatile is prepended to left of the identifier and to the right of the type.

Assignments
So what happens when we try to modify a [volatile qualified object with a non-qualified type](http://www.embedded.com/electronics-blogs/programming-pointers/4025624/Volatile-as-a-promise). How does our beloved compiler deal with it.

```
int volatile *pvi; //pointer to volatile int.
```
```
int* pi ; //pointer to an int.
```
```
pvi = pi;
```

What happens or should happen is that the compiler will upgrade the non-volatile type to a volatile qualified type. The best way, if you want to stop the compiler from optimizing the accesses to *pi is to cast it as a volatile qualified type and then recast it.

> "If it is necessary to access a nonvolatile object using volatile semantics, the technique is to cast the address of the object to the appropriate pointer-to- qualified type, then dereference that pointer." - C99 standard:

> CHECKPOINT: When modifying a volatile type with non-volatile type, the compiler will implicitly cast the non- volatile type to a volatile type.

What about the other way around. What would happen if we do

```
pi = pvi;
```
Now the compiler would or should throw a warning that says something like I don’t get what you are trying to do so I am just dropping the volatile keyword. Some older compilers might not complain at all, in which case you have screwed up badly and you don’t even know it yet.

#### Function Parameters
The above problem is more profound when using volatile with functions. Consider the following
code.

```
int i;
int* pi;
int volatile* pvi;
int func(int i, int* pi);
```
```
func(i,pvi);
```
In this case the compiler will again throw a warning or an error complaining that the function func expects pi and you are passing pvi so I am just discarding the volatile. Avoid this type of code in all cases. According to the C standard this is an undefined behavior, which means anything can happen, including [demons flying out from your nose](http://www.catb.org/jargon/html/N/nasal-demons.html). Yes, nasal demons are possible if the compiler writers consider it to be an important language extension and they are even allowed by the C standard to do that.


> "If an attempt is made to refer to an object defined with a volatile-qualified type through us of an lvalue with non-volatile-qualified type, the behavior is undefined"--- C99 Standard.

> CHECKPOINT: When modifying a non-volatile type with volatile type, the compiler should throw a warning, if it doesn’t then raise a ticket to your compiler team.

### VOLATILE AND ATOMIC ACCESSES

> “ ‘Atomic’ means that the access to the variable is in ‘one piece’, and cannot be interrupted, or performed in multiple steps which can be interrupted.” — [Master yoda, wikipedia](https://en.wikipedia.org/wiki/Linearizability)


#### Problem

The following code is representative of an ISR, where wait() is a function called by the user and timer_interrupt() which is an ISR, increments the variable on which wait() takes a decision. This situation can also occur in multiple threads where one threads increments a variable and the other takes a decision on the incremented variable.

```
volatile uint16_t my_delay;
```
```
void wait(uint16_t time) {
    my_delay = 0;
    while (my_delay<time) {
    /* wait .... */
}
}
```
```
void timer_interrupt(void) {
    my_delay++;
}[i]
```
We now know that the compiler won’t optimize the while loop, because my_delay is declared volatile. It won’t produce the desired effect, because increment is not an atomic operation. There are some architectures that do provide atomic increment instructions. As a general rule you can't be sure if this is an atomic operation. In other words the compiler will use three separate instructions for increment: it will first read, modify and then write to my_delay.

For example if an ISR occurs, the value of my_delay is read and modified, and before it is written, another interrupt occurs. The wait() function will read my_delay in the meantime and get the old value, this is called a torn read.

The problem that we are dealing with now is different, and as we will see later, the solution might also take care of the need for volatile so we might not need volatile at all. This is an important use case and we have to understand when volatile is not enough to solve the problem. So we should understand which instructions are atomic, and when atomic instructions are needed in multiple threads.

#### Understanding Atomic Instructions
First we need to define a rule about where atomic instructions are necessary. As a general rule of thumb, any time two threads operate on a shared variable concurrently, and one of those operations perform a write, both threads must use atomic operations. Find more information about atomicity [here](http://preshing.com/20130618/atomic-vs-non-atomic-operations/).


Increment is one operation for which the compiler explicitly uses three separate instructions but there are certain operations for which the compiler uses one instruction but the actual implementation treats it as two separate instructions. Like in [armv7 strd](http://web.eecs.umich.edu/~prabal/teaching/eecs373-f10/readings/ARMv7-M_ARM.pdf) is an instruction that stores the value of two 32-bit registers to one 64-bit memory location, but under the hood it performs two 32-bit stores. So you just can't be sure which operations are atomic until you have read the compiler specifications or hardware vendors manual. Following are a few checkpoints about atomicity

> CHECKPOINTS:

> All C, C++ operations are non-atomic unless specified by the compiler and hardware vendor

> Naturally aligned reads are atomic. But we can’t be sure if 8-byte word accesses are atomic or not.

> Naturally unaligned reads are non-atomic.

> Composite operations, the read modify write type, are non-atomic.

#### Solution
So the solution to the above problem is to make accesses atomic. We can do this by using locks on our critical code. In our case the critical code is accessing my_delay so we should acquire the lock before an access and release it after the access. Locks can perform a number of functions, but in our case we want it to disable the interrupts so that no interrupt occurs during the access.

In the following code EnterCritical and ExitCritical disables the interrupts.

```
volatile uint16_t my_delay;
```
```
void wait(uint16_t time) {
    uint16_t tmp;
```
```
    EnterCritical();
    my_delay = 0;
    ExitCritical();
```
```
    do {
        EnterCritical();
        tmp = my_delay;
        ExitCritical();
```
```
    } while(tmp<time);
}
```
```
void TimerInterrupt(void) {
    EnterCritical();
    my_delay++;
    ExitCritical();
}
```

### VOLATILE AND REORDERING

Another issue with using volatile in a multiple threads or an ISR is the lack of understanding of reordering. In order to show you the severity of this problem let's discuss an example.

#### Problem
The following is a simple example of a complex situation that is very common in embedded world. We often have multiple threads where one is sending a message and then updating a flag and the other is waiting for the flag to get updated to read the message. Consider the following [code](https://software.intel.com/en-us/blogs/2007/11/30/volatile-almost-useless-for-multi-threaded-programming/):

```
volatile int ready;
int Message[100];
```
```
void foo( int i )
{
    Message[i/10] = 42;
    Ready = 1;
}
```
```
void Thread2(i)
{
    while(ready != 1);
    //read message
}
```
In the above code foo() is updating the message array and subsequently updating the flag, informing thread 2 that the data is ready. Thread2 is waiting for the ready flag value to be equal to one, after which it could read the message. Notice the use of volatile with ready, If ready wasn’t volatile then the compiler might have removed the while block altogether, but this is not enough.

If you compile the above code with gcc with -O2 optimization the ready flag will be updated before the message is updated. Thus thread 2 will be forced to read the old value of the message.

The most common solution to this problem, which is generally our default solution as developers, is to make message volatile as well. This will solve the problem but it will result in an inefficient code. Worse yet it might not even fix the problem because the machine has yet to do some reordering of its own. Yes, the machine also reorders our code.

In order to break this problem down we need to understand reordering. There are two types of reordering.

#### Compiler Reordering
The above code is a clear case of compiler reordering. In fact the compiler is at liberty to reorder any code that it deems necessary as long as the output is the same. Thus in order to make sure that the reads and writes are performed in a specific order, there is a language extension availableby most compilers called the compiler barrier.

```
asm volatile ("" : : : "memory");
```

This is how we use it to solve our problem.

```
volatile int ready;
int message[100];
```
```
void foo (int i) {
    message[i/10] = 42;
    asm volatile ("" : : : "memory");
    ready = 1;
}
```
This instruction dumps all of RAM before the barrier and reloads them afterwards. Plus the compiler is not allowed to reorder code across this barrier.

Another solution would be to use a call to an external function which the compiler cannot see inside. This is also the reason most bugs magically disappear when you use printf debugging.

Although major compilers like gcc, intel CC, and LLVM do provide this option, compiler barrier itself is not an elegant solution as some compilers might not provide it. The best solution is to use memory barriers.

#### CPU Reordering
CPU reordering, also known as machine reordering, is more subtle and difficult to catch but happens in most modern machines. The idea is that while one read is happening at the bus level, and the data is not available yet, another independent instruction can be executed and the read can be completed after the data is available. This is, of course, only one way of machine reordering, there are a lot of ways in which code on an [out-of-order](https://en.wikipedia.org/wiki/Out-of-order_execution) machine gets executed.

The solution for CPU reordering is to use memory barriers. Memory barriers are provided by almost all processors. Following is an example of [FreeRTOS code](https://github.com/arthurjrfloripa/mcuoneclipse/blob/master/Drivers/freeRTOS/port.c) that creates a context switch within an ISR. We need memory barriers here so that before the context switch, all the data and instruction code is synchronized.

```
void vPortYieldFromISR(void) {
```
```
/* Set a PendSV to request a context switch. */
```
```
*(portNVIC_INT_CTRL) = portNVIC_PENDSVSET_BIT;
```

```
/* Barriers are normally not required but do ensure the
code is completely within the specified behavior for the
architecture. */
```
```
__asm volatile("dsb");
```
```
__asm volatile("isb");
```
```
}
```
The two assembly instructions dsb, and isb are “data synchronization barrier” and “instruction synchronization barrier respectively”. These will ensure that data and instructions sections of the code get serialized. Read more about them [here](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dai0321a/index.html).

In most multi-threaded setting you will use a variant of enter_critical and exit_critical region that will enforce serialization within and across the region, they serve as locks. These locks should be properly implemented to make sure that no unwanted reordering across the region occurs. Also once inside the region we can be sure the locks will prevent unwanted optimizations. Thus having volatile objects inside this region serves no purpose.

### VOLATILE IN A KERNEL SETTING


> "volatile" on kernel data is basically always a bug, and you should use locking. "volatile" doesn't help anything at all with memory ordering and friends, so it's insane to think it "solves" anything on its own.” — LINUS TROVALDS, [Linux Group Post](https://lwn.net/Articles/233484/)

This seems redundant at this point but has a special significance to it. There has been a lot of [debate in the linux community](https://lwn.net/Articles/233479/) around the use of volatile. This section is especially dedicated to summarizing the confusion around this use case. This section is also here to differentiate the application of volatile on baremetal where there is no kernel. Thus if you are not in a kernel setting you only have to take care of the above problems.

In a kernel setting as in multithreaded environment you can be sure to have kernel locking primitives which make the data safe i.e. mutexes, spinlocks and barriers. These locks are designed to also prevent unwanted optimizations and make sure the operations are atomic on both the cpu and compiler level. Thus if they are being used properly then you don’t need volatile.

Thus the only significant use of volatile (that one can think of) in a kernel setting can be for accessing a memory mapped IO. Since you don’t want the compiler to optimize out the register accesses within the critical region, you still have to use volatile inside the critical region even if you use locks around those accesses. But in most kernel settings you have special accessor functions for accessing IO memory regions, because accessing this memory region directly is frowned upon in a kernel setting. These accessor functions must make sure to prevent any unwanted optimizations and if they do it properly then volatile is not needed.

### Conclusion
In this article, I have tried to discuss the problems that one should consider when using volatile. These use cases are important because they address behaviors of compilers and machine which is not commonly understood. I hope you can now find out what is wrong with the code discussed in the introduction and how you can fix it. In the next article, I will address the use cases where volatile is necessary.

Editor's note: Updated for corrections 7 Aug 2016.


