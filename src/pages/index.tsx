import { useEffect, useState } from 'react';
import init, { convert_to_silhouette } from '@/pkg/webassembly'

export const Home = ()=>{
  useEffect(()=>{
    init();
  },[])

  const [imageUrl,setImageUrl] = useState<string | null>(null);

  const convertToSilhouette = async (event:React.ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0];
    if (!file) return ;

    const reader = new FileReader();
    reader.onload = async ()=>{
      const imgData = new Uint8Array(reader.result as ArrayBuffer);

      const silhouetteImgData = convert_to_silhouette(imgData);

      const blob = new Blob([silhouetteImgData],{type:'img/png'});
      const url = URL.createObjectURL(blob);
      setImageUrl(url)
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadSilhouette = ()=>{
    if (!imageUrl) return ;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'silhouette.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <>
    <input type='file' onChange={convertToSilhouette} />
    {imageUrl && <img src={imageUrl} alt="Silhouette" style={{maxWidth:'500px',maxHeight:'500px'}} />}
    {imageUrl && <button onClick={downloadSilhouette}>シルエットをダウンロード</button>}
    </>
  )
}

export default Home
