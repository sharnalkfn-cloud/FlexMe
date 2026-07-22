import type { ImageSourcePropType } from 'react-native';

/**
 * Manually maintained map of scene id -> local reference image.
 *
 * React Native's bundler (Metro) only supports static `require()` calls, so
 * this map cannot be generated dynamically from a file listing. To add a
 * scene's reference image:
 *
 *   1. Drop the real Gemini-generated image at
 *      assets/images/scenes/<filename>.jpg (see docs/SCENES_README.md for
 *      naming and format rules).
 *   2. Add one line here: `<sceneId>: require('../assets/images/scenes/<filename>.jpg')`.
 *
 * Scenes with no entry here fall back to the gradient + emoji placeholder
 * in SceneCard / MasonrySceneCard.
 */
export const SCENE_IMAGES: Partial<Record<string, ImageSourcePropType>> = {
  // 'lamborghini_pov': require('../assets/images/scenes/lamborghini-pov.jpg'),
  // 'dubai_jetski': require('../assets/images/scenes/dubai-jetski.jpg'),
  // 'dubai_shopping_lambo': require('../assets/images/scenes/dubai-shopping-lambo.jpg'),
  // 'girlfriend_jet_bugatti': require('../assets/images/scenes/girlfriend-jet-bugatti.jpg'),
  // 'highrise_pool': require('../assets/images/scenes/highrise-pool.jpg'),
};

export function getSceneImageSource(sceneId: string): ImageSourcePropType | undefined {
  return SCENE_IMAGES[sceneId];
}
