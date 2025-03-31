declare module '@tensorflow/tfjs-node' {
    import * as tf from '@tensorflow/tfjs';
    export * from '@tensorflow/tfjs';
    
    export namespace node {
      function decodeImage(buffer: Uint8Array | Buffer, channels?: number): tf.Tensor3D;
      function encodeJpeg(tensor: tf.Tensor3D, format?: 'grayscale' | 'rgb'): Buffer;
      function encodePng(tensor: tf.Tensor3D, format?: 'grayscale' | 'rgb'): Buffer;
    }
  }