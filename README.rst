Bookie-Firefox
===============
The goal is to setup an extension that enables using Bookie with Firefox.

Setting up
----------
Once you check out from git, you'll need to get the external depenencies, the
firefox sdk and the Bookie static library collection. You can get both of
these using the Makefile.

::

    $ make all

If you want to test against update versions you can fetch the latest by
cleaning and making again.

::

    $ make clean
    $ make all

Activating the sdk
-------------------
Once the sdk is installed, you have to activate that virtualenv. Right now
it's a bit of a pita, you have to cd to the sdk dir, activate, and then back
out again.

::

    cd sdk
    source bin/activate
    cd ../

