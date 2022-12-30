import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const Detection = () => {
const [imageUrl, setImageUrl] = useState('');
const [objects, setObjects] = useState();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const imageRef = React.useRef(null);
const canvasRef = React.useRef(null);

const handleFileInput = e => {
    console.log('handlefileinput');
setImageUrl(URL.createObjectURL(e.target.files[0]));
}

useEffect(() => {
if (imageUrl) {
    console.log('useeffect');
const detectObjects = async () => {
setIsLoading(true);
setError('');
try {
// Load the model
const model = await tf.loadGraphModel('https://fypdeployment2.b-cdn.net/best_web_model/model.json');
if(model){
    console.log('model loaded');
}else{
    console.log('errrrrrrrr');
}
      // Load the image as a Tensor
      const image = tf.browser.fromPixels(imageRef.current);

      // Resize the image
      const resizedImage = tf.image.resizeBilinear(image, [640, 640]);

      // Normalize the image
      const normalizedImage = tf.div(resizedImage, tf.scalar(255.0));

      // Expand the dimensions of the image
      const x = tf.expandDims(normalizedImage, 0);
     
      x.print();
      console.log(x);
    

      // Detect objects in the image
    
     
      
      const predictions = await model.executeAsync(x);
      
      if(predictions){
        console.log("prediction");
        console.log(predictions);
      }else{
        console.log('error')
      }
      setObjects(predictions);

      // Render the bounding boxes on the canvas

      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      console.log(ctx);
      predictions.forEach(prediction => {
        console.log('called canvas');
        ctx.beginPath();
        ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
        ctx.stroke();
      });
    } catch (e) {
      setError(e.error);
    } finally {
      setIsLoading(false);
    }
  }
  detectObjects();
}
}, [imageUrl])

return (
<div>
<input type="file" onChange={handleFileInput} accept="image/*" />
{isLoading && <p>Loading...</p>}
{error && <p>Error: {error}</p>}
<div style={{ position: 'relative' }}>
<img alt='' src={imageUrl} ref={imageRef} />
<canvas id='canvas' ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
</div>
{objects &&(
    <div>
        {objects.map((prediction, i)=>(

            <div key={i}>
{prediction.shape}

            </div>
        ))}
    </div>
)}

</div>
);
}

export default Detection;