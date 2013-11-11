Bookie-Firefox
===============
The goal is to setup an extension that enables using Bookie with Firefox.

Setting up
----------
Once you check out from git, you'll need to get the external dependencies, the
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


Running the tests
-----------------
The tests require that the sdk be activated. You can run them with the ``make
test`` command.


Testing the extension
----------------------
You can load a new Firefox window with the extension loaded with ``make run``.
This will use the sdk to launch the Firefox instance and can be used for dev
and qa work.


Known limitations/issues
------------------------

- Cannot ping/validate your api preferences since we're using a simple-pref
  modules for preferences
