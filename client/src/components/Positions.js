import React, {useEffect, useState} from 'react'
import { Marker,Tooltip,GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { FeatureGroup } from 'react-leaflet';
import zoneMLAT from './zones/zoneMLAT.json'
import zoneIrk from './zones/zoneIRKUTSK.json'

export const ZoneIrk = ()=>{
    const [borderData, setBorderData] = useState([zoneIrk]);  
    const allGSN=borderData.map((data,id) => {        
        const geojson0 = data.features[0].geometry;                
        const geojson1 = data.features[1].geometry;  
        const geojson2 = data.features[2].geometry;  
        return ( 
            <FeatureGroup key={"fg_zoneI"+id}>
                <GeoJSON key={'key_zI0'+id} data={geojson0} pathOptions={{color:'yellow'}} />               
                <GeoJSON key={'key_zI1'+id} data={geojson1} pathOptions={{color:'blue'}} />               
                <GeoJSON key={'key_zI2'+id} data={geojson2} pathOptions={{color:'white'}} />               
            </FeatureGroup>                       
        )
    })
    return allGSN;
}

export const ZoneMLAT = ()=>{
    const [borderData, setBorderData] = useState([zoneMLAT]);  
    const allGSN=borderData.map((data,id) => {        
        const geojson0 = data.features[0].geometry;                        
        return ( 
            <FeatureGroup key={"fg_zoneM"+id}>
                <GeoJSON key={'key_zoneM'+id} data={geojson0} pathOptions={{color:'pink'}} />                               
            </FeatureGroup>                       
        )
    })
    return allGSN;
}

const colorIicon = (color)=>{     
    const style=
        `background-color: hsl(${color},100%,40%);
        width:1rem;
        height:1rem;
        display:block;
        left:-0.5rem;
        top:-0.5rem;
        position:relative;
        border-radius: 1rem 1.2rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF;`        

    return L.divIcon({
  className: "my-custom-pin",
  iconAnchor: [0, 0],
  labelAnchor: [0, 0],
  popupAnchor: [0,0],
  html: `<span style="${style}" />`
})}

export const Positions = () =>{        
    const {request} = useHttp();
    const [positions, setPositions]=useState([]);
  //  console.log("POSITIONS RENDER!!",positions.length);
    const readPositionsFromServer = async ()=>{
        try{
            const response = await request('/mlat/positions','GET');                     
            const geojson = response.data;          
            let myPos=[];        
            for (let i=0;i<geojson.features.length;i++){           
                if (geojson.features[i].properties.id){
                    myPos.push(                
                        <Marker 
                            key={geojson.features[i].properties.id} 
                            position={L.latLng([
                                geojson.features[i].geometry.coordinates[1],
                                geojson.features[i].geometry.coordinates[0]
                                ])}
                            icon={colorIicon(geojson.features[i].properties.id*360/(geojson.features.length-3))}> 
                            <Tooltip direction="top"  >
                                {geojson.features[i].properties.name}
                            </Tooltip>
                        </Marker>     
                    )
                }                        
            }      
            setPositions(myPos)                    
        }catch(e){
            console.log("Error READ POSITIONS!!!",e);
        }
    }

    React.useEffect(() =>{           
        readPositionsFromServer();
    },[])
    
    return (        
        <>         
        <FeatureGroup>
            {positions}      
        </FeatureGroup>         
        </>
    )

}
