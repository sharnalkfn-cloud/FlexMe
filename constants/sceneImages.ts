import type { ImageSourcePropType } from 'react-native';

/**
 * Manually maintained map of scene id -> local reference image. React
 * Native's bundler (Metro) only supports static `require()` calls, so this
 * can't be generated dynamically from a folder listing.
 */
export const SCENE_IMAGES: Partial<Record<string, ImageSourcePropType>> = {
  girlfriend_jet_bugatti: require('../assets/images/Scene/girl.png'),
  dubai_valet: require('../assets/images/Scene/image.png'),
  dubai_shopping_lambo: require('../assets/images/Scene/lnb.png'),
  highrise_pool: require('../assets/images/Scene/qdc.png'),
};

export function getSceneImageSource(sceneId: string): ImageSourcePropType | undefined {
  return SCENE_IMAGES[sceneId];
}
