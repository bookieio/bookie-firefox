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
