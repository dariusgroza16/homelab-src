set export := true
set quiet := true
set shell := ["bash","-cu"]

this_dir := justfile_directory()
image_name := "dariusmurk/homelab-fe"

_default:
   just --list

[doc("build homelab image with latest tag")]
build:
  docker image rm -f $image_name:latest
  docker build -f $this_dir/Dockerfile -t $image_name:latest .

[doc("build homelab image with version tag")]
bv version:
  docker image rm -f $image_name:$version
  docker build -f $this_dir/Dockerfile -t $image_name:$version .

[doc("run homelab container with latest tag")]
run:
  docker run -d -p 3000:3000 --name 'homelab-fe' $image_name:latest

[doc("run homelab container with version tag")]
rv version:
  docker run -d -p 3000:3000 --name 'homelab-fe' $image_name:$version

[doc("View logs of homelab container")]
logs:
  docker logs -f homelab-fe

[doc("kill and remove homelab container")]
kill:
  docker kill homelab-fe
  docker rm homelab-fe