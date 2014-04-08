Bookie-Firefox
===============
The goal is to setup an extension that enables using Bookie with Firefox.

Current development release
----------------------------
You can test the current build by heading to http://files.bmark.us/bookie.xpi.
Note that this is alpha quality and most functions don't work. Currently you
get a widget in the add-on bar and can save a bookmark once you've set your
preferences.

We've started to submit the extension to Mozilla for review at:

https://addons.mozilla.org/en-US/firefox/addon/bookie/

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

Alternatively, you can run ``cfx xpi`` after navigating to the src folder
like so.

::

    cd src
    cfx xpi

Open the Firefox browser and point the url to about:config. Add a new key
with name : "extensions.sdk.console.logLevel" and key: "info" to set the
required logging level.

Hit Ctrl/Cmd + Shift + A to open the Add-On Manager. Install the extension
manually by clicking the gear icon and selecting "Install Add-on from File..."
You may access the Add-On Manager using Tools -> Add-ons.

After the extension has been installed, hit Ctrl/Cmd + Shift + J to bring
up the Browser Console that houses all the log messages. You may access
the Browser Console using Tools -> Web Developer -> Browser Console.

Known limitations/issues
------------------------

- Cannot ping/validate your api preferences since we're using a simple-pref
  modules for preferences
