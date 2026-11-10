import React from 'react';
import { characterArtworkRegistry } from '../artwork';
import type { CharacterAssetRegistry } from '../types';
import {
  getCustomizedCanonicalLayerIds,
  normalizeAvatarCustomization,
} from './catalog';
import type { AvatarCustomizationConfig } from './types';
import {
  ArmVariantArtwork,
  BlushVariantArtwork,
  BodyVariantArtwork,
  EyebrowsVariantArtwork,
  EyesVariantArtwork,
  FxVariantArtwork,
  HeadVariantArtwork,
  LegVariantArtwork,
  MouthVariantArtwork,
  ShadowVariantArtwork,
} from './variants';

/**
 * Composes a complete 12-layer CharacterAssetRegistry from WebMate's built-in avatar
 * selections while returning unmodified original artwork directly for uncustomized layers.
 */
export function buildMergedArtworkRegistry(
  customization?: Partial<AvatarCustomizationConfig> | null,
  fallbackRegistry: CharacterAssetRegistry = characterArtworkRegistry
): CharacterAssetRegistry {
  const resolved = normalizeAvatarCustomization(customization);
  const customizedIds = new Set(getCustomizedCanonicalLayerIds(resolved));

  if (customizedIds.size === 0) {
    return fallbackRegistry;
  }

  return {
    'layer-shadow': customizedIds.has('layer-shadow') ? (
      <ShadowVariantArtwork shadowStyle={resolved.shadowStyle} />
    ) : (
      fallbackRegistry['layer-shadow']
    ),
    'layer-leg-left': customizedIds.has('layer-leg-left') ? (
      <LegVariantArtwork
        side="left"
        shoeStyle={resolved.shoeLeftStyle}
        shoeColor={resolved.shoeLeftColor}
        bottomStyle={resolved.bottomStyle}
        bottomColor={resolved.bottomColor}
        skinTone={resolved.skinTone}
      />
    ) : (
      fallbackRegistry['layer-leg-left']
    ),
    'layer-arm-left': customizedIds.has('layer-arm-left') ? (
      <ArmVariantArtwork
        side="left"
        armStyle={resolved.armLeftStyle}
        handStyle={resolved.handLeftStyle}
        topStyle={resolved.topStyle}
        topColor={resolved.topColor}
        skinTone={resolved.skinTone}
      />
    ) : (
      fallbackRegistry['layer-arm-left']
    ),
    'layer-leg-right': customizedIds.has('layer-leg-right') ? (
      <LegVariantArtwork
        side="right"
        shoeStyle={resolved.shoeRightStyle}
        shoeColor={resolved.shoeRightColor}
        bottomStyle={resolved.bottomStyle}
        bottomColor={resolved.bottomColor}
        skinTone={resolved.skinTone}
      />
    ) : (
      fallbackRegistry['layer-leg-right']
    ),
    'layer-body': customizedIds.has('layer-body') ? (
      <BodyVariantArtwork
        bodyStyle={resolved.bodyStyle}
        topStyle={resolved.topStyle}
        topColor={resolved.topColor}
        bottomStyle={resolved.bottomStyle}
        bottomColor={resolved.bottomColor}
      />
    ) : (
      fallbackRegistry['layer-body']
    ),
    'layer-arm-right': customizedIds.has('layer-arm-right') ? (
      <ArmVariantArtwork
        side="right"
        armStyle={resolved.armRightStyle}
        handStyle={resolved.handRightStyle}
        topStyle={resolved.topStyle}
        topColor={resolved.topColor}
        skinTone={resolved.skinTone}
      />
    ) : (
      fallbackRegistry['layer-arm-right']
    ),
    'layer-head': customizedIds.has('layer-head') ? (
      <HeadVariantArtwork
        headStyle={resolved.headStyle}
        skinTone={resolved.skinTone}
        hairStyle={resolved.hairStyle}
        hairColor={resolved.hairColor}
      />
    ) : (
      fallbackRegistry['layer-head']
    ),
    'layer-blush': customizedIds.has('layer-blush') ? (
      <BlushVariantArtwork
        blushStyle={resolved.blushStyle}
        blushColor={resolved.blushColor}
      />
    ) : (
      fallbackRegistry['layer-blush']
    ),
    'layer-eyebrows': customizedIds.has('layer-eyebrows')
      ? (props) => (
          <EyebrowsVariantArtwork
            expression={props.expression}
            eyebrowStyle={resolved.eyebrowStyle}
            eyebrowColor={resolved.eyebrowColor}
            hairColor={resolved.hairColor}
          />
        )
      : fallbackRegistry['layer-eyebrows'],
    'layer-eyes': customizedIds.has('layer-eyes')
      ? (props) => (
          <EyesVariantArtwork
            expression={props.expression}
            eyeStyle={resolved.eyeStyle}
            eyeColor={resolved.eyeColor}
          />
        )
      : fallbackRegistry['layer-eyes'],
    'layer-mouth': customizedIds.has('layer-mouth')
      ? (props) => (
          <MouthVariantArtwork
            expression={props.expression}
            mouthStyle={resolved.mouthStyle}
          />
        )
      : fallbackRegistry['layer-mouth'],
    'layer-fx': customizedIds.has('layer-fx')
      ? (props) => (
          <FxVariantArtwork
            expression={props.expression}
            fxStyle={resolved.fxStyle}
            fxColor={resolved.fxColor}
          />
        )
      : fallbackRegistry['layer-fx'],
  };
}
