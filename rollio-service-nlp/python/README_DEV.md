# Rolio Python Dev Environment Info

## TL;DR
1. Install `pyenv` and python 3.6.6 with it [sdf](#Env)
2. Fix environment
3. Only track direct project references in `requirements.txt`
4. Use `install_deps.sh` for updating project modules

## Environment Setup (MacOS)
Scripts assume that the correct version of python is reachable as `python` and not (for example) `python3` which happens on some platforms.

The suggested tool is `pyenv` which allows installing multiple python versions and switching between them.  (Some IDEs, notably VSCode, support Python environments installed with `pyenv`).

```
$ brew install pyenv
$ pyenv install 3.6.6
$ pyenv global 3.6.6
```

In your `.bash_profile` you should make several changes in support of `pyenv` and other stuff:

```
export PATH=./python_modules/bin:$(pyenv root)/shims:$PATH
export PYTHONPATH=./python_modules
```

If you have open terminal windows you will have to close/reopen them or `source ~/.bash_profile` to reflect these changes.

This adds the pyenv shim to the path and also supports our local modules directory (see next section).

## Module Management

Python module management is often confusing because there are global and local (to the user) module paths, as well as optional `virtualenv` setups that may have additional modules, but only if they are activated, and not all IDEs play well with virtualenvs (not to mention automated tests etc.). Our setup assumes none of that, and manages all modules within the project tree.

The `requirements.txt` file for a project should contain a list of all *direct* dependencies of the project.  This includes runtime dependencies (i.e. `boto3`), build/test tools (i.e. `pytest`, `invoke`), and containers (i.e. `gunicorn`, `celery`).  We should track specific versions in these files where it makes sense (in most cases, to be conservative).

The `install_deps.sh` script installs the modules from `requirements.txt` (and any dependencies) into a local `python_modules` directory.  This directory should not be checked into source control (it should be in `.gitignore`).  The change to PYTHONPATH, above, allows code to find these modules.

### Add a new module
1. Update `requirements.txt` - provide the module, and a version if possible
2. Run `install_deps.sh`


## Get parser endpoint running
```
export FLASK_APP=app.py
flask run
```

## To run the docker image locally
```
docker build -t nlp:latest .
docker run -d -p 5000:5000 nlp
```
you can confirm that the image is running by going to http://127.0.0.1:5000/ in your browswer.  You should see "Hello there!".  Be patient- it can take a minute

## To simply test the nlp parser from your command line

```
python update_model.py
```
Then, just type in an example tweet (e.g. 'see you at Union Station') and hit enter

```
Windows Troubleshoot
1. ensure using python3 64 bit
2. Target install packages to correct folder
   pip3 install --target="C:\Users\Farris Ismati\Desktop\Code Projects\rollio\rollio-service-nlp\python\python_modules" spacy==2.2.3 flask==0.12.2
   py -m pip install --target="C:\Users\Farris Ismati\Desktop\Code Projects\rollio\rollio-service-nlp\python\python_modules" spacy==2.2.3 flask==0.12.2
3. Debug spacy 4 windows error https://spacy.io/usage#troubleshooting
