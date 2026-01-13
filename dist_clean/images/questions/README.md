# Academic Question Images

This folder contains images used for image-based academic questions in the PhyloMaze game.

## Current Images

The following images should be placed in this directory:

1. **stop-sign.png** - Stop sign for traffic safety question
2. **propane-tank.png** - Propane tank for safety handling question
3. **wrench.png** - Wrench tool for identification question
4. **elephant.png** - Elephant for largest land animal question

## Image Requirements

- **Format**: PNG (recommended) or JPG
- **Size**: Keep file size under 200KB for optimal loading
- **Dimensions**: Recommended max height 300px (will be displayed at max-h-32 = 128px)
- **Quality**: Clear, recognizable images suitable for educational purposes

## Adding New Image Questions

1. Add the image file to this directory
2. Update `src/data/academicQuestions.json` with a new question object:
   ```json
   {
     "id": "img_yourimage",
     "text": "Your question text?",
     "options": ["Option 1", "Option 2", "Option 3"],
     "answer": "Correct answer",
     "type": "image",
     "category": "General",
     "image": "/images/questions/yourimage.png"
   }
   ```

## Image Display

Images are displayed in the MazeGame.tsx component at lines 1101-1113 with:
- Max height of 128px
- Object-contain to preserve aspect ratio
- Centered in a bordered container
- Error handling for failed loads

## Notes

- Images are served from the `public` folder
- Paths in JSON should start with `/images/questions/`
- Make sure images are free to use or properly licensed
- Test images load correctly before deploying
