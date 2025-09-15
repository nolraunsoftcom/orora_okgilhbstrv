const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const {Buffer} = require('buffer');

async function generateIOSIcons(imagePath) {
  const iosDir = path.join(
    __dirname,
    '/../ios/pungmuprugio/Images.xcassets/AppIcon.appiconset',
  );
  await fs.ensureDir(iosDir);

  const sizes = [
    {idiom: 'iphone', size: '20x20', scale: '2x', value: 40},
    {idiom: 'iphone', size: '20x20', scale: '3x', value: 60},
    {idiom: 'iphone', size: '29x29', scale: '2x', value: 58},
    {idiom: 'iphone', size: '29x29', scale: '3x', value: 87},
    {idiom: 'iphone', size: '40x40', scale: '2x', value: 80},
    {idiom: 'iphone', size: '40x40', scale: '3x', value: 120},
    {idiom: 'iphone', size: '60x60', scale: '2x', value: 120},
    {idiom: 'iphone', size: '60x60', scale: '3x', value: 180},
    {idiom: 'ipad', size: '20x20', scale: '1x', value: 20},
    {idiom: 'ipad', size: '20x20', scale: '2x', value: 40},
    {idiom: 'ipad', size: '29x29', scale: '1x', value: 29},
    {idiom: 'ipad', size: '29x29', scale: '2x', value: 58},
    {idiom: 'ipad', size: '40x40', scale: '1x', value: 40},
    {idiom: 'ipad', size: '40x40', scale: '2x', value: 80},
    {idiom: 'ipad', size: '76x76', scale: '1x', value: 76},
    {idiom: 'ipad', size: '76x76', scale: '2x', value: 152},
    {idiom: 'ipad', size: '83.5x83.5', scale: '2x', value: 167},
    {idiom: 'ios-marketing', size: '1024x1024', scale: '1x', value: 1024},
  ];

  const sizeSet = new Set();
  sizes.forEach(size => {
    sizeSet.add(size.value);
  });

  for (const size of sizeSet) {
    const outputFilePath = path.join(iosDir, `${size}.png`);
    await sharp(imagePath).resize(size, size).toFile(outputFilePath);
  }

  const contents = {
    images: sizes.map(item => ({
      filename: `${item.value}.png`,
      idiom: item.idiom,
      scale: item.scale,
      size: item.size,
    })),
    info: {
      version: 1,
      author: 'xcode',
    },
  };
  fs.writeFileSync(
    path.join(iosDir, 'Contents.json'),
    JSON.stringify(contents, null, 2),
  );
}

async function generateAndroidIcon(inputImagePath) {
  const androidFolders = [
    {folder: 'mipmap-mdpi', size: 48},
    {folder: 'mipmap-hdpi', size: 72},
    {folder: 'mipmap-xhdpi', size: 96},
    {folder: 'mipmap-xxhdpi', size: 144},
    {folder: 'mipmap-xxxhdpi', size: 192},
  ];

  const outputDir = path.join(__dirname, '/../android/app/src/main/res');
  for (const {folder, size} of androidFolders) {
    const folderPath = path.join(outputDir, folder);
    await fs.ensureDir(folderPath);

    const convertedImagePath = path.join(
      __dirname,
      '/../files/playstore-icon.png',
    );
    await sharp(inputImagePath)
      .resize(512, 512)
      .png()
      .toFile(convertedImagePath);

    const outputFilePath = path.join(folderPath, `ic_launcher.png`);
    await sharp(convertedImagePath).resize(size, size).toFile(outputFilePath);

    const roundOutputFilePath = path.join(folderPath, `ic_launcher_round.png`);
    await sharp(convertedImagePath)
      .resize(size, size)
      .composite([
        {
          input: Buffer.from(
            `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${
              size / 2
            }" fill="white"/></svg>`,
          ),
          blend: 'dest-in',
        },
      ])
      .toFile(roundOutputFilePath);
  }
}

const imagePath = path.join(__dirname, 'icon.jpg');
if (fs.existsSync(imagePath)) {
  generateIOSIcons(imagePath);
  generateAndroidIcon(imagePath);
} else {
  console.error(
    'Input image not found. Please provide a valid image at:',
    imagePath,
  );
}
