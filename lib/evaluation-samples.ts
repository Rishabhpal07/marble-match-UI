const evaluationSampleFilenames = [
  "img_001__B05B_lighting_lookalike.jpg",
  "img_005__B04A_occlusion_same.jpg",
  "img_006__B03A_lighting_lookalike.jpg",
  "img_007__B01A_occlusion_same.jpg",
  "img_008__B02A_lighting_same.jpg",
  "img_009__B04A_lighting_same.jpg",
  "img_010__B03B_rotation_scale_same.jpg",
  "img_012__B03B_viewpoint_same.jpg",
  "img_013__B01B_viewpoint_lookalike.jpg",
  "img_016__B03A_occlusion_lookalike.jpg",
  "img_017__B02A_viewpoint_same.jpg",
  "img_019__B01B_lighting_lookalike.jpg",
  "img_020__B05A_rotation_scale_same.jpg",
  "img_021__B01A_rotation_scale_same.jpg",
  "img_025__B04B_rotation_scale_lookalike.jpg",
  "img_030__B04B_viewpoint_lookalike.jpg",
  "img_031__B02B_occlusion_lookalike.jpg",
  "img_042__B05B_occlusion_lookalike.jpg",
  "img_046__B02B_rotation_scale_lookalike.jpg",
  "img_048__B05A_viewpoint_same.jpg",
] as const;

export type EvaluationCondition =
  | "lighting"
  | "occlusion"
  | "rotation_scale"
  | "viewpoint";

export type EvaluationLabel = "same" | "lookalike";

export type EvaluationSample = {
  filename: string;
  imageId: string;
  referenceId: string;
  condition: EvaluationCondition;
  label: EvaluationLabel;
  src: string;
};

const filenamePattern =
  /^(img_\d+)__(B\d+[AB])_(lighting|occlusion|rotation_scale|viewpoint)_(same|lookalike)\.jpg$/;

export const evaluationSamples: EvaluationSample[] = evaluationSampleFilenames.map(
  (filename) => {
    const match = filenamePattern.exec(filename);

    if (!match) {
      throw new Error(`Invalid evaluation sample filename: ${filename}`);
    }

    return {
      filename,
      imageId: match[1],
      referenceId: match[2],
      condition: match[3] as EvaluationCondition,
      label: match[4] as EvaluationLabel,
      src: `/dataset/${filename}`,
    };
  }
);

export function getEvaluationSample(filename: string | null) {
  if (!filename) {
    return undefined;
  }

  return evaluationSamples.find((sample) => sample.filename === filename);
}
