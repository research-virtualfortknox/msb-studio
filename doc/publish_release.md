# Release Guide

This is just an introduction how to publish releases manually.

This will be depreceated by using a CI tool.

## Requirements

Requirements before publishing project to public registry:
* Version is stable (ci pipeline success)
* All tests passed

## Update Version

First upgrade project to new version using

```sh
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch ]
```

## Publish Version Of Library (travis)

TODO!

Travis CI will automatically publish the project to docker registry if:
* project version was updated using `npm version`
* new version commited
* git `TAG` has beed created for commit

## Publish Version Of Library (manual)

### Init Workspace

Setup a docker runtime (docker host) to build the project an generate a docker image.

Build the docker image:

```sh
$ docker build -t vfk_research/vfk_research_registry/vfk.msb/vfk.msb.studio:<new-version> .
```

### Step 1: Test Build Result

Before publishing the project to a docker registry, 
make sure the right sources will be added.

Run docker container for your new image:

```sh
$ docker run -d --restart always --name vfk.msb.studio -p 8080:80 vfk_research/vfk_research_registry/vfk.msb/vfk.msb.studio:<new-version>
```

Open http://localhost:3000 and test the UI.

You can also inspect the container and review the content of the /app directory.

### Step 2: Publish

Publish the release to a docker registry.

Login to the registry if required:

```sh
$ docker login <registry-url>
```

Set a new tag for your image to match the registry path:
```sh
docker tag vfk_research/vfk_research_registry/vfk.msb/vfk.msb.studio:<new-version> <registry-url>/<path>/vfk.msb/vfk.msb.studio:<new-version>
```

Push the image to the registry:
```sh
docker push <registry-url>/<path>/vfk.msb/vfk.msb.studio:<new-version>
```

### Step 3: Check Result

Login to the docker registry and review the uploaded version. Run a container based on the uploaded image.
