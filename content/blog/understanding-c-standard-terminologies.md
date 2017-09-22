+++
date = "2017-07-12T11:55:50+08:00"
title = "Understanding C terminologies, a dummies perspective"
author = "Best Author Ever"

+++


*****

Consider the following example, lets call this tcode1 for future reference.

    /*tocode1.c*/
    void func(int a, int b);
    void f(int i);

    void func( int a, int b){
     printf(“%d %d”, a, b)
    }

    void f(int i) {
     func(i++, i);
    }

    int main(void){
     f(5);
    }


This hypothetical example came up in a discussion at lunch in my office, when a
friend said that he expected a to be 6, b to be 5 but he got a=5, and b=6. I
knew that the order in which arguments are passed to a function is unspecified,
so it could have been a=6, and b=5. But then my friend questioned me in detail
about unspecified behavior and what is the logic of making these things
unspecified in the first place and then I realized that I only knew the jargon
but didn’t actually understand them. I couldn’t convey the meaning of the terms
to him. So I went on to do my research again and it turns out that in tcode1 the
call to func is an “*undefined behavior*”, which is bad; how bad? lets find out.

Lets start with why I thought it was an unspecified behavior, from the C99
standard 3.4.4

> **unspecified behavior** is the use of an unspecified value, or other behavior
> where this International Standard provides two or more possibilities and imposes
no further requirements on which is chosen in any instance.

there is also implementation defined behavior which is the same as unspecified,
but in this case the compiler has documented the implementation as to which
choice is taken in a certain instance. From the standard** 3.4.1**

> **implementation-defined behavior** is an unspecified behavior where each
> implementation documents how the choice is made.
> An example of implementation-defined behavior is the propagation of the
> high-order bit when a signed integer is shifted right.

So things such as the size of an int, whether char is signed or unsigned or the
size of a pointer can be either unspecified or implementation defined behavior.
This behavior should be consistent for one implementation but they can vary for
others. So the size of an int can be different on different machines.

And also from the C Standard, 6.5.2.2, paragraph 10 [[ISO/IEC
9899:2011](https://www.securecoding.cert.org/confluence/display/c/AA.+Bibliography#AA.Bibliography-ISO-IEC9899-2011)]

> Every evaluation in the calling function (including other function calls) that
> is not otherwise specifically sequenced before or after the execution of the
body of the called function, is indeterminately sequenced with respect to the
execution of the called function.

In simple terms the above rule means that the order of evaluation for function
call arguments is unspecified and can happen in any order. The evaluation can be
left to right or right to left for different machines and different
implementations on the same machines. In other words its unspecified.

Consider the following example of code which depends on an unspecified behavior
and thus is wrong.

    /* example1.c */
    void fun(int n, int m);

    int fun1()
    {
     pritnf(“fun1”);
     return 1;
    }

    int fun2()
    {
     printf( “fun2” );
     return 2;
    }

    …
    fun(fun1(), fun2()); // which one is executed first?

    /* From <
    >*/

As explained above, we cant be sure whether func1 is executed first or func2, it
is upto the compiler to do whatever it wants.

In tcode1.c, inside foo(i++,I), the code depended on the arguments passed and
its bad because you cant depend on the arguments passed. This proves that the
code in tcode1.c is at best unspecified, which is bad if you want to write
portable code. But as I said this code is *undefined* not *unspecified*, so lets
define *undefined behavior* .

From the C standard 3.4.3

> **undefined behavior** is the behavior, upon use of a nonportable or erroneous
> program construct or of erroneous data, for which this International Standard imposes no requirements

The famous undefined behaviors are

* Divide by zero
* Dereference a null pointer
* Signed integer overflow
* Using an initialized variable.

In case of unspecified or implementation defined behavior the compiler had two
or more options defined by the standard and it had to take either one and
document it or not. But in case of undefined behavior, there is no option
specified by the standard so the compiler can do whatever it wants.

From the C standard in the same place where it defines the undefined behavior,
there is a note that says

> Possible undefined behavior ranges from ignoring the situation completely with
> unpredictable results, to behaving during translation or program execution in a
documented manner characteristic of the environment (with or without the
issuance of a diagnostic message), to terminating a translation or execution
(with the issuance of a diagnostic message).

So compilers may chose to avoid certain errors in the program or do anything that it wants instead of throwing an error. The famous things that compilers do
when they come across an undefined behavior are format your hard drive, get your
girlfriend pregnant, and make nasal daemons fly out of your nostrils.

![nostril_demons](https://cdn-images-1.medium.com/max/1100/0*l2B-SECYYeaHmSrA.jpg)

*Nostril demons, image referenced from [http://scienceblogs.com/stoat/2014/12/06/4082/](%5Bhttp://scienceblogs.com/stoat/2014/12/06/4082/)*

Now that we have unspecified behavior and undefined behavior lets have a look at
how easily can shit hit the ceiling when dealing with unspecified behavior. We
know passing arguments to the function is unspecified.

Have a look at the following code.

    /* example2.c */
    extern void c(int i, int j);
    int glob;

    int a(void) {
     return glob + 10;
    }

    int b(void) {
     glob = 42;
     return glob;
    }

    void func(void) {
     c(a(), b());
    }

    /* copied from
    *https://www.securecoding.cert.org/confluence/display/c/EXP30-C.+Do+not+depend+on+the+order+of+evaluation+for+side+effects
    */

It can happen that b() is called first, and glob is assigned a value, or it
might happen that a() is called first and glob is accessed uninitialized, which
is undefined. Also remember the principle rule of undefined behavior

> “If a part of a code is undefined, the whole code is undefined.”
> [regehr awsome blog](http://blog.regehr.org/archives/213)

In case of our tcode1 only **foo(i++,i)** is undefined. What makes this
undefined and not unspecified. For this we need to understand sequence points
first.

From the c standard 5.1.2.3

> At certain specified points in the execution sequence called sequence points,
> all side effects of previous evaluations shall be complete and no side effects
of subsequent evaluations shall have taken place.

In short it’s the place when the dust has been settled. So if you place a
breakpoint between a sequence point you will see the updated values of
expressions till that instructions. What is this “side effects” used in the
above definition, from the C standard 5.1.2.3

> *Accessing a volatile object, modifying an object, modifying a file, or calling
> a function that does any of those operations are all side effects, which are
changes in the state of the execution environment. Evaluation of an expression
may produce side effects.*

In other words side effects are the micro instructions beyond which the code
cant be broken down (on the abstraction level at least). Think of these as
atoms, you have nutrons, protons, electrons inside an atom but still atom is the
lowest unit, if you break an atom then you release a large amount of
uncontrolled energy.

So according to standard only the following are side effects

 1. accessing a volatile object
 2. modifying an object
 3. modifying a file
 4. a call to a function which performs any of the above side effects

In summary an expression is made up of side effects and sequence points occur
between expressions. The following are the places where sequence points occur,
from the C standard annex C

1.  The call to a function, after the arguments have been evaluated.
1.  The end of the first operand of the following operators: logical AND &&; logical
OR || ; conditional ? ; comma , .
1.  The end of a full declarator;
1.  The end of a full expression: an initializer; the expression in an expression
statement; the controlling expression of a selection statement (if or switch) ;
the controlling expression of a while or do statement ; each of the expressions
of a for statement; the expression in a return statement.
1.  Immediately before a library function returns.
1.  After the actions associated with each formatted input/output function
conversion
1.  specifier.
1.  Immediately before and immediately after each call to a comparison function, and
1.  also between any call to a comparison function and any movement of the objects
1.  passed as arguments to that call.

From the above we see that there are no sequence points between function
arguments (remember this as the silver_rule) .

So we have side effects, we know what and where sequence points are but how is
tcode1 undefined. Lets have a look at the golden_rule of undefinededness. from
the clang_faqs

> *Between the previous and next sequence point an object shall have its stored
> value modified at most once by the evaluation of an expression. Furthermore, the
prior value shall be accessed only to determine the value to be stored.*

This rule has two parts,

1.  In an expression an object shall have its value modified at most once
1.  Any access to prior value should be done to determine the value to be stored.

According to the rule the following is an undefined behavior,

    i=i++;

Because the value of i is modified twice in an expression it breaks part 1 of
the golden_rule. Now consider the following

    a[i]=i++;

This is wrong because it breaks part 2 of the golden_rule. There are multiple
accesses to **i**; and one of them **is not** for determining the value to be
stored in **i.** If **i=2**, then when the compiler is done with the expression,
we just cant be sure if the final values are a[1]=1 or, a[2]=2, or a[1]=2 (the
access is done first or the value is incremented first). Also you can see that
this connects with a host of other undefined behaviors. For example the array
might only have a size of 2, and there is no such thing as a[2], so when our
code accesse a[2] we get a garbage value which when manipulated on executes a
code that formats our hard drive.

So finally lets have a look back at tcode1, why is this undefined behavior.

    foo(i++,i)

I am sure you can guess by now. We now know that there are no sequence points
between arguments (silver_rule), and from the above example it should be clear
that it breaks part 2 of the golden_rule. Thus this is an undefined behavior.


![](https://cdn-images-1.medium.com/max/1100/0*CoZ_jgiLV3MlGvRX.jpg)

*image referecend from somewhere on google*


When I compile and run tcode1 I get the following answer

    $ ./tcode1

    5, 6

which shows that a=5, b-6, no warning, no error. But this does not mean that
this will happen everytime.

From [regehrs blog](http://blog.regehr.org/archives/213)

> *Somebody once told me that in basketball you can’t hold the ball and run. I got
> a basketball and tried it and it worked just fine. He obviously didn’t
understand basketball.*

> *(*[This explanation is due to Roger Miller via Steve
> Summit](http://www.eskimo.com/~scs/readings/undef.950311.html)*.)*
