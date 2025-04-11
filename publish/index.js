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
    execSync(versionCommand, { stdio: 'inherit' }); // Error happens here

    // ... rest of your script ...

  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

runPublish();