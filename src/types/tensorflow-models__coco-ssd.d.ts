declare module '@tensorflow-models/coco-ssd' {
    import * as tf from '@tensorflow/tfjs-core';
    
    export interface DetectedObject {
      bbox: [number, number, number, number];  // [x, y, width, height]
      class: string;
      score: number;
    }
    
    export interface ObjectDetection {
      detect(
        img: tf.Tensor3D | ImageData | HTMLImageElement | 
             HTMLCanvasElement | HTMLVideoElement | Buffer,
        maxNumBoxes?: number
      ): Promise<DetectedObject[]>;
    }
    
    export function load(config?: {
      base?: 'mobilenet_v1' | 'mobilenet_v2' | 'lite_mobilenet_v2';
      modelUrl?: string;
    }): Promise<ObjectDetection>;
  }