#include <chunk>




uniform float uTime;
uniform float uDate;
uniform vec4 uMousePos;
uniform vec3 uViewPos;
uniform float uInstanceCount;

out float vInstanceID;
out vec3 vPos;
out float vDepth;
out vec3 vNormal;
out float vIsDrop;
out float vIsVisible;
out float vDistView;




void main() {
  float count = 50.0;
  float idx = float(gl_InstanceID);
  float x = mod(idx, count);
  float z = floor(idx / count);
  float y = mod(idx, 2.0);

  vec2 size = vec2(0.01)*(100.0/count)*8.0;


  //! POSITION
  vec3 pos = vec3(x, 0.0, 0.0);
  pos.xz *= size;
  pos.xz -= size*count*0.5;
  pos.y -= rand(vec2(x+sin(idx), z+cos(idx)))*10.0;

  pos.y -= uTime*0.001;
  pos.x -= uTime*0.001;

  float t = clamp(tan(pos.y*0.25), 0.0, 100.0);

  if (rand(vec2(pos.xy)) >= 0.2) 
  {
    pos.x = t*0.5*(-pos.x);
    pos.y = t*0.5*(-pos.y);
  }

  pos.x = mod(pos.x, 10.0)-5.0;
  pos.y = mod(pos.y, 5.0); 

  //! INVISIBLE
  float dist = distance(uViewPos, pos);
  vDistView = dist;
  if (rand(vec2(pos.xy)) >= 1.0)  {
    gl_PointSize = (0.0);
    vIsVisible = 0.0;
  } else {
    gl_PointSize = 5.0-dist*4.0;
    vIsVisible = 1.0;
  }



  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;





  vInstanceID = idx;
  vPos = pos;
}