const { execSync } = require('child_process');

async function runPublish() {
  try {
    console.log('--- Starting publish process ---');

    // Check Git status and potentially clean
    const gitStatus = execSync('git status --porcelain').toString().trim();
    if (gitStatus) {
      console.warn('Warning: Git working directory is not clean. Attempting to clean...');
      execSync('git add .'); // Add all changes
      execSync('git commit -m "Autocommit before version bump"', { stdio: 'ignore' });
      console.log('Autocommit performed.');
    } else {
      console.log('Git working directory is clean.');
    }

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

    const newVersion = execSync('npm pkg get version').toString().trim();
    const commitMessage = `version ${newVersion}`;
    console.log(`Committing changes: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('Changes committed to Git.');

    const shouldPush = process.argv.includes('--push');
    if (shouldPush) {
      console.log('Pushing to Git...');
      execSync('git push origin HEAD', { stdio: 'inherit' });
      console.log('Pushed to Git.');
    } else {
      console.log('Skipping Git push (use --push to push)');
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