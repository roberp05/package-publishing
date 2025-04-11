const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runPublish() {
  try {
    console.log('--- Starting publish process ---');
    console.log('Git working directory is clean.');

    console.log('Running build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build complete.');

    const versionType = process.argv[2];
    if (!['patch', 'minor', 'major'].includes(versionType)) {
      console.error('Error: Please provide a valid version type (patch, minor, or major) as an argument.');
      process.exit(1);
    }
    console.log(`Target version increment: ${versionType}`);

    const versionCommand = `npm version ${versionType}`;
    console.log(`Executing: ${versionCommand}`);
    execSync(versionCommand, { stdio: 'inherit' });
    console.log('Version updated in package.json and package-lock.json.');

    console.log('Adding package files to Git...');
    execSync('git add package*.json', { stdio: 'inherit' });
    console.log('package*.json added to Git.');

    const newVersion = execSync('npm pkg get version').toString().trim().replace(/^"|"$/g, '');
    const commitMessage = `version ${newVersion}`;
    console.log(`Committing changes: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('Changes committed to Git.');

    const shouldPush = process.argv.includes('--push');
    if (shouldPush) {
      console.log('Pushing to Git...');
      execSync('git push origin HEAD', { stdio: 'inherit' });
      console.log('Pushed to Git.');

      // Create and push Git tag
      const tagName = `v${newVersion}`;
      console.log(`Creating Git tag: ${tagName}`);
      execSync(`git tag ${tagName}`);
      console.log(`Pushing Git tag: ${tagName}`);
      execSync(`git push origin ${tagName}`);
      console.log('Git tag created and pushed.');
    } else {
      console.log('Skipping Git push and tag (use --push to include)');
    }

    console.log('Publishing to npm...');
    execSync('npm publish', { stdio: 'inherit' });
    console.log('Successfully published to npm.');

    console.log('--- Publish process complete ---');

  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

runPublish();