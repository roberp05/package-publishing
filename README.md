# package-publishing
This is a test repo for npm publish and github tagging leading to `gh release`.

## Versioning
`major`.`minor`.`patch` methodology, this is not breaking any ground in it implementation.  Using `npm version patch`, `npm version minor` and `npm version major`.  This process will incrememnt the version number automatucally. 

## npm publish
The `npm cli` contains all the necessary methods to do this process manually using `npm publish --access public` this does have the public access switch applied to it for this demo, this will not be necessary for the actual implementation.

## git tag
Standard tagging in git is enough for us to be able to distinguish different tagged versions and download then, `git tag -a "v1.0.4" -m "A message."`  then a tag push using `git push origin v1.0.4`.

## github release
This will take tagging one step further, this will have a npm`esque` release page and downloading correctly with `npm install` this method also allows for the `latest` tag.  This method will allow us to distinguish pre-release, release-candidate and alpha versionsof the same code and we can handle the scenarios separately.