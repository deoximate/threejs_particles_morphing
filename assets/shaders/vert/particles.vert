#include <chunk>


uniform float uTime;
uniform float uDate;
uniform vec4 uMousePos;
uniform vec3 uViewPos;
uniform float uInstanceCount;
uniform float uDPR;
uniform float uDPI;

out float vInstanceID;
out vec3 vPos;
out float vDepth;
out vec3 vNormal;
out float vIsDrop;
out float vIsVisible;
out float vDistView;




void main() {
  float count = 150.0;
  float idx = float(gl_InstanceID);
  float x = mod(idx, count);
  float z = floor(idx / count);
  float y = mod(idx, 2.0);



  vec2 size = vec2(0.01)*(100.0/count)*16.0;

  //! POSITION
  vec3 pos = vec3(x, 0.0, z);
  float viewPosDist = distance(uViewPos, pos);

  pos.xz *= size;
  pos.xz -= size*count*0.5;
  pos.y -= 0.25;
  pos.xz -= 1.75; 

  //! INVISIBLE
  float dist = distance(vec3(0.0), vPos);
  if (rand(vec2(pos.xy)) >= 1.0)  {
    gl_PointSize = (0.0);
    vIsVisible = 0.0;
  } else {
    gl_PointSize = 2.0;
    vIsVisible = 1.0;
  }


  float t = uTime*0.1;
  pos.y *= surface3(vec3(pos.xz*0.1+uTime*0.1, 0.0));



  //gl_PointSize *= uDPR;


  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;



  vDistView = viewPosDist;
  vInstanceID = idx;
  vPos = pos;
}


