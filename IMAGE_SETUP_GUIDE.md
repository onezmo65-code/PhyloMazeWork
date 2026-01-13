# Image-Based Questions Setup Guide

This guide explains how the image-based academic questions system works in PhyloMaze.

## System Overview

The game now supports displaying images alongside academic questions. This feature enhances learning by providing visual context for certain types of questions.

## How It Works

### 1. Question Data Structure

Image questions are defined in [src/data/academicQuestions.json](src/data/academicQuestions.json) with these fields:

```json
{
  "id": "img_stop",
  "text": "What does this sign mean?",
  "options": ["Stop", "Go", "Yield"],
  "answer": "Stop",
  "type": "image",
  "category": "General",
  "image": "/images/questions/stop-sign.png"
}
```

**Key fields:**
- `type`: Set to `"image"` to indicate this question has an image
- `image`: Path to the image file (relative to public folder)

### 2. Image Storage

All question images are stored in:
```
public/images/questions/
```

This folder is served statically by Vite during development and in the production build.

### 3. Display Logic

The MazeGame component ([src/components/MazeGame.tsx](src/components/MazeGame.tsx#L1101-L1113)) displays images using:

```tsx
{modal.question.image && (
  <div className="mb-3 rounded-lg overflow-hidden border border-slate-600 bg-white/10 flex justify-center p-2">
    <img
      src={modal.question.image}
      alt="Question"
      className="max-h-32 object-contain"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        console.error('Image failed to load:', modal.question?.image);
      }}
    />
  </div>
)}
```

**Features:**
- Only displays if `image` field exists
- Max height of 128px (Tailwind: `max-h-32`)
- Maintains aspect ratio (`object-contain`)
- Error handling hides broken images
- Logs failed image loads to console

## Current Image Questions

The system currently includes 4 image-based questions:

| ID | Question | Image |
|---|---|---|
| `img_stop` | What does this sign mean? | stop-sign.png |
| `img_propane` | What safety precaution is most important when handling propane tanks? | propane-tank.png |
| `img_wrench` | What is this tool commonly used for? | wrench.png |
| `img_elephant` | What is the largest land animal on Earth? | elephant.png |

## Adding New Image Questions

### Step 1: Prepare Your Image

1. Choose a clear, recognizable image
2. Optimize for web (PNG or JPG, under 200KB)
3. Recommended max dimensions: 300x300px
4. Ensure image is free to use or properly licensed

### Step 2: Add Image to Project

1. Save the image to `public/images/questions/`
2. Use a descriptive filename (e.g., `traffic-light.png`)

### Step 3: Add Question to JSON

Edit `src/data/academicQuestions.json` and add:

```json
{
  "id": "img_yourquestion",
  "text": "Your question text here?",
  "options": ["Option A", "Option B", "Option C"],
  "answer": "Correct option",
  "type": "image",
  "category": "General",
  "image": "/images/questions/your-image.png"
}
```

### Step 4: Test

1. Build the web assets: `npm run build`
2. Sync to Android: `npx cap sync android`
3. Build APK: `cd android && ./gradlew assembleDebug`
4. Install and test on device

## Troubleshooting

### Image Not Displaying

**Check:**
1. File exists in `public/images/questions/`
2. Path in JSON starts with `/images/questions/`
3. Filename matches exactly (case-sensitive)
4. Image file is valid (try opening in browser)

**Console check:**
Open browser DevTools and look for error messages like:
```
Image failed to load: /images/questions/missing.png
```

### Image Too Large or Distorted

**Solution:**
- The `max-h-32` class limits height to 128px
- `object-contain` preserves aspect ratio
- If image still looks wrong, resize the source file

### Android Build Issues

After adding new images:
1. Run `npm run build` to copy public assets
2. Run `npx cap sync android` to update Android project
3. Rebuild APK

## Technical Details

### Image Loading Process

1. **Development (Vite)**:
   - Images served from `public/` folder
   - Hot reload works with image changes

2. **Production Build**:
   - `npm run build` copies `public/` to `dist/`
   - Capacitor copies `dist/` to Android assets
   - Android WebView loads images from app assets

### Performance Considerations

- Images are lazy-loaded (only when question appears)
- Max height constraint prevents memory issues
- Error handling prevents crashes on missing images
- No preloading (to reduce initial bundle size)

## Best Practices

1. **Image Selection**:
   - Choose clear, unambiguous images
   - Avoid copyrighted material
   - Use simple, recognizable subjects

2. **File Management**:
   - Keep filenames lowercase with hyphens
   - Group related images (e.g., `safety-*.png`)
   - Remove unused images to reduce app size

3. **Question Design**:
   - Make sure image directly relates to question
   - Provide clear answer options
   - Test on small screens (image must be recognizable at 128px)

4. **Testing**:
   - Test on multiple devices
   - Check both portrait and landscape modes
   - Verify images load on slow connections

## Future Enhancements

Potential improvements:
- Image preloading for better performance
- Multiple images per question
- Image zoom/fullscreen view
- Support for GIFs or animations
- Image caching strategy

## Support

For issues or questions about image-based questions:
1. Check console for error messages
2. Verify file paths and structure
3. Review this guide
4. Test with known working image first

---

**Last Updated**: January 2, 2026
**Feature Status**: Active and tested
