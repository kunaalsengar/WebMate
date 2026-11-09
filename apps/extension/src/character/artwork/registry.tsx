import React from 'react';
import type { CharacterAssetRegistry } from '../types';
import { ShadowArtwork } from './ShadowArtwork';
import { LegLeftArtwork } from './LegLeftArtwork';
import { ArmLeftArtwork } from './ArmLeftArtwork';
import { LegRightArtwork } from './LegRightArtwork';
import { BodyArtwork } from './BodyArtwork';
import { ArmRightArtwork } from './ArmRightArtwork';
import { HeadArtwork } from './HeadArtwork';
import { BlushArtwork } from './BlushArtwork';
import { EyebrowsArtwork } from './EyebrowsArtwork';
import { EyesArtwork } from './EyesArtwork';
import { MouthArtwork } from './MouthArtwork';
import { EffectsArtwork } from './EffectsArtwork';

/**
 * Built-in 12-Layer Original Character Artwork Registry
 *
 * Maps all 12 canonical character layer IDs to their respective original vector artwork components.
 * Dynamic layers (eyebrows, eyes, mouth, blush, fx) receive LayerRenderProps to respond
 * seamlessly to expression and animation state transitions.
 */
export const characterArtworkRegistry: CharacterAssetRegistry = {
  'layer-shadow': <ShadowArtwork />,
  'layer-leg-left': <LegLeftArtwork />,
  'layer-arm-left': <ArmLeftArtwork />,
  'layer-leg-right': <LegRightArtwork />,
  'layer-body': <BodyArtwork />,
  'layer-arm-right': <ArmRightArtwork />,
  'layer-head': <HeadArtwork />,
  'layer-blush': (props) => <BlushArtwork opacity={props.opacity} />,
  'layer-eyebrows': (props) => <EyebrowsArtwork expression={props.expression} />,
  'layer-eyes': (props) => <EyesArtwork expression={props.expression} />,
  'layer-mouth': (props) => <MouthArtwork expression={props.expression} />,
  'layer-fx': (props) => <EffectsArtwork expression={props.expression} />,
};

export default characterArtworkRegistry;

