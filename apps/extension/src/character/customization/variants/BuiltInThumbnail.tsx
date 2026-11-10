import React from 'react';
import { SKIN_TONE_PALETTES } from '../palettes';
import type {
  ArmSleeveStyleId,
  AvatarCustomizationConfig,
  BlushStyleId,
  BodyStyleId,
  BottomStyleId,
  EyebrowStyleId,
  EyeStyleId,
  FxStyleId,
  HairStyleId,
  HandStyleId,
  HeadStyleId,
  MouthStyleId,
  ShadowStyleId,
  ShoeColorId,
  ShoeStyleId,
  TopStyleId,
} from '../types';
import { BodyVariantArtwork } from './BodyAndClothingVariants';
import {
  BlushVariantArtwork,
  EyebrowsVariantArtwork,
  EyesVariantArtwork,
  MouthVariantArtwork,
} from './FaceFeatureVariants';
import { HeadVariantArtwork } from './HeadAndHairVariants';
import { ArmVariantArtwork, LegVariantArtwork } from './LimbVariants';
import { FxVariantArtwork, ShadowVariantArtwork } from './ShadowAndFxVariants';

export type ThumbnailSubject =
  | { kind: 'head'; headStyle: HeadStyleId }
  | { kind: 'hair'; hairStyle: HairStyleId }
  | { kind: 'eyes'; eyeStyle: EyeStyleId }
  | { kind: 'eyebrows'; eyebrowStyle: EyebrowStyleId }
  | { kind: 'mouth'; mouthStyle: MouthStyleId }
  | { kind: 'blush'; blushStyle: BlushStyleId }
  | { kind: 'body'; bodyStyle: BodyStyleId }
  | { kind: 'top'; topStyle: TopStyleId }
  | { kind: 'bottom'; bottomStyle: BottomStyleId }
  | { kind: 'arm-sleeve'; armStyle: ArmSleeveStyleId }
  | { kind: 'hand'; handStyle: HandStyleId }
  | { kind: 'shoe'; shoeStyle: ShoeStyleId; shoeColor: ShoeColorId }
  | { kind: 'shadow'; shadowStyle: ShadowStyleId }
  | { kind: 'fx'; fxStyle: FxStyleId };

export interface BuiltInThumbnailProps {
  subject: ThumbnailSubject;
  config: AvatarCustomizationConfig;
}

function getThumbnailViewBox(kind: ThumbnailSubject['kind']): string {
  switch (kind) {
    case 'head':
      return '54 32 92 94';
    case 'hair':
      return '50 22 100 100';
    case 'eyes':
      return '64 72 72 32';
    case 'eyebrows':
      return '66 60 68 38';
    case 'mouth':
      return '82 91 44 26';
    case 'blush':
      return '58 76 84 46';
    case 'body':
      return '62 119 76 82';
    case 'top':
      return '56 118 88 66';
    case 'bottom':
      return '66 168 68 66';
    case 'arm-sleeve':
      return '112 122 44 66';
    case 'hand':
      return '122 162 32 28';
    case 'shoe':
      return '94 212 42 32';
    case 'shadow':
      return '50 220 100 28';
    case 'fx':
      return '48 20 104 86';
  }
}

export const BuiltInThumbnail: React.FC<BuiltInThumbnailProps> = ({ subject, config }) => {
  const skin = SKIN_TONE_PALETTES[config.skinTone] ?? SKIN_TONE_PALETTES['warm-peach'];
  const viewBox = getThumbnailViewBox(subject.kind);

  const renderContent = () => {
    switch (subject.kind) {
      case 'head':
        return (
          <g>
            <HeadVariantArtwork
              headStyle={subject.headStyle}
              skinTone={config.skinTone}
              hairStyle={config.hairStyle}
              hairColor={config.hairColor}
            />
            <g opacity="0.55">
              <EyebrowsVariantArtwork
                expression="normal"
                eyebrowStyle={config.eyebrowStyle}
                eyebrowColor={config.eyebrowColor}
                hairColor={config.hairColor}
              />
              <EyesVariantArtwork
                expression="normal"
                eyeStyle={config.eyeStyle}
                eyeColor={config.eyeColor}
              />
              <MouthVariantArtwork expression="normal" mouthStyle={config.mouthStyle} />
            </g>
          </g>
        );

      case 'hair':
        return (
          <g>
            <HeadVariantArtwork
              headStyle={config.headStyle}
              skinTone={config.skinTone}
              hairStyle={subject.hairStyle}
              hairColor={config.hairColor}
            />
            <g opacity="0.35">
              <EyesVariantArtwork
                expression="normal"
                eyeStyle={config.eyeStyle}
                eyeColor={config.eyeColor}
              />
              <MouthVariantArtwork expression="normal" mouthStyle={config.mouthStyle} />
            </g>
          </g>
        );

      case 'eyes':
        return (
          <g>
            <rect x="64" y="72" width="72" height="32" rx="8" fill={skin.base} opacity="0.45" />
            <EyesVariantArtwork
              expression="normal"
              eyeStyle={subject.eyeStyle}
              eyeColor={config.eyeColor}
            />
          </g>
        );

      case 'eyebrows':
        return (
          <g>
            <rect x="66" y="60" width="68" height="38" rx="8" fill={skin.base} opacity="0.45" />
            <g opacity="0.28">
              <EyesVariantArtwork
                expression="normal"
                eyeStyle={config.eyeStyle}
                eyeColor={config.eyeColor}
              />
            </g>
            <EyebrowsVariantArtwork
              expression="normal"
              eyebrowStyle={subject.eyebrowStyle}
              eyebrowColor={config.eyebrowColor}
              hairColor={config.hairColor}
            />
          </g>
        );

      case 'mouth':
        return (
          <g>
            <rect x="82" y="91" width="44" height="26" rx="8" fill={skin.base} opacity="0.55" />
            <MouthVariantArtwork expression="normal" mouthStyle={subject.mouthStyle} />
          </g>
        );

      case 'blush':
        return (
          <g>
            <g opacity="0.55">
              <HeadVariantArtwork
                headStyle="classic-chibi"
                skinTone={config.skinTone}
                hairStyle="clean-crop"
                hairColor={config.hairColor}
              />
            </g>
            <g opacity="0.28">
              <EyesVariantArtwork
                expression="happy"
                eyeStyle={config.eyeStyle}
                eyeColor={config.eyeColor}
              />
              <MouthVariantArtwork expression="normal" mouthStyle={config.mouthStyle} />
            </g>
            {subject.blushStyle === 'none' ? (
              <g opacity="0.65">
                <circle cx="100" cy="100" r="9" fill="none" stroke="#64748B" strokeWidth="1.6" />
                <line x1="94" y1="106" x2="106" y2="94" stroke="#64748B" strokeWidth="1.6" />
              </g>
            ) : (
              <BlushVariantArtwork
                blushStyle={subject.blushStyle}
                blushColor={config.blushColor}
              />
            )}
          </g>
        );

      case 'body':
        return (
          <g>
            <BodyVariantArtwork
              bodyStyle={subject.bodyStyle}
              topStyle={config.topStyle}
              topColor={config.topColor}
              bottomStyle={config.bottomStyle}
              bottomColor={config.bottomColor}
            />
          </g>
        );

      case 'top':
        return (
          <g>
            <ArmVariantArtwork
              side="left"
              armStyle="match-outfit"
              handStyle={config.handLeftStyle}
              topStyle={subject.topStyle}
              topColor={config.topColor}
              skinTone={config.skinTone}
            />
            <BodyVariantArtwork
              bodyStyle={config.bodyStyle}
              topStyle={subject.topStyle}
              topColor={config.topColor}
              bottomStyle={config.bottomStyle}
              bottomColor={config.bottomColor}
            />
            <ArmVariantArtwork
              side="right"
              armStyle="match-outfit"
              handStyle={config.handRightStyle}
              topStyle={subject.topStyle}
              topColor={config.topColor}
              skinTone={config.skinTone}
            />
          </g>
        );

      case 'bottom':
        return (
          <g>
            <LegVariantArtwork
              side="left"
              shoeStyle={config.shoeLeftStyle}
              shoeColor={config.shoeLeftColor}
              bottomStyle={subject.bottomStyle}
              bottomColor={config.bottomColor}
              skinTone={config.skinTone}
            />
            <LegVariantArtwork
              side="right"
              shoeStyle={config.shoeRightStyle}
              shoeColor={config.shoeRightColor}
              bottomStyle={subject.bottomStyle}
              bottomColor={config.bottomColor}
              skinTone={config.skinTone}
            />
            <BodyVariantArtwork
              bodyStyle={config.bodyStyle}
              topStyle={config.topStyle}
              topColor={config.topColor}
              bottomStyle={subject.bottomStyle}
              bottomColor={config.bottomColor}
            />
          </g>
        );

      case 'arm-sleeve':
        return (
          <g>
            <ArmVariantArtwork
              side="right"
              armStyle={subject.armStyle}
              handStyle={config.handRightStyle}
              topStyle={config.topStyle}
              topColor={config.topColor}
              skinTone={config.skinTone}
            />
          </g>
        );

      case 'hand':
        return (
          <g>
            <ArmVariantArtwork
              side="right"
              armStyle="short-sleeve"
              handStyle={subject.handStyle}
              topStyle={config.topStyle}
              topColor={config.topColor}
              skinTone={config.skinTone}
            />
          </g>
        );

      case 'shoe':
        return (
          <g>
            <LegVariantArtwork
              side="right"
              shoeStyle={subject.shoeStyle}
              shoeColor={subject.shoeColor}
              bottomStyle="classic-shorts"
              bottomColor={config.bottomColor}
              skinTone={config.skinTone}
            />
          </g>
        );

      case 'shadow':
        return (
          <g>
            {subject.shadowStyle === 'none' ? (
              <g>
                <g opacity="0.45">
                  <LegVariantArtwork
                    side="left"
                    shoeStyle={config.shoeLeftStyle}
                    shoeColor={config.shoeLeftColor}
                    bottomStyle={config.bottomStyle}
                    bottomColor={config.bottomColor}
                    skinTone={config.skinTone}
                  />
                  <LegVariantArtwork
                    side="right"
                    shoeStyle={config.shoeRightStyle}
                    shoeColor={config.shoeRightColor}
                    bottomStyle={config.bottomStyle}
                    bottomColor={config.bottomColor}
                    skinTone={config.skinTone}
                  />
                </g>
                <line
                  x1="64"
                  y1="242"
                  x2="136"
                  y2="242"
                  stroke="#94A3B8"
                  strokeWidth="1.4"
                  strokeDasharray="4,3"
                />
              </g>
            ) : (
              <>
                <g opacity="0.5">
                  <LegVariantArtwork
                    side="left"
                    shoeStyle={config.shoeLeftStyle}
                    shoeColor={config.shoeLeftColor}
                    bottomStyle={config.bottomStyle}
                    bottomColor={config.bottomColor}
                    skinTone={config.skinTone}
                  />
                  <LegVariantArtwork
                    side="right"
                    shoeStyle={config.shoeRightStyle}
                    shoeColor={config.shoeRightColor}
                    bottomStyle={config.bottomStyle}
                    bottomColor={config.bottomColor}
                    skinTone={config.skinTone}
                  />
                </g>
                <ShadowVariantArtwork shadowStyle={subject.shadowStyle} />
              </>
            )}
          </g>
        );

      case 'fx':
        return (
          <g>
            <g opacity="0.4">
              <HeadVariantArtwork
                headStyle={config.headStyle}
                skinTone={config.skinTone}
                hairStyle={config.hairStyle}
                hairColor={config.hairColor}
              />
            </g>
            {subject.fxStyle === 'none' ? (
              <g opacity="0.7">
                <circle cx="100" cy="64" r="10" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.8" />
                <line x1="93" y1="71" x2="107" y2="57" stroke="#64748B" strokeWidth="1.8" />
              </g>
            ) : (
              <>
                <FxVariantArtwork
                  expression="happy"
                  fxStyle={subject.fxStyle}
                  fxColor={config.fxColor}
                />
                <FxVariantArtwork
                  expression="surprised"
                  fxStyle={subject.fxStyle}
                  fxColor={config.fxColor}
                />
              </>
            )}
          </g>
        );
    }
  };

  return (
    <svg
      viewBox={viewBox}
      className="webmate-thumb-svg"
      aria-hidden="true"
      focusable="false"
    >
      {renderContent()}
    </svg>
  );
};

