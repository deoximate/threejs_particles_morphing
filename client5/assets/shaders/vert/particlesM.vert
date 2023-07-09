#include <chunk>

uniform sampler2D tDraw;


uniform float uTime;
uniform float uDate;
uniform vec4 uMousePos;
uniform vec4 uMousePosPlane;
uniform vec3 uViewPos;
uniform float uInstanceCount;

out float vInstanceID;
out vec3 vPos;
out float vDepth;
out vec3 vNormal;
out float vIsDrop;
out float vIsVisible;
out float vDistView;
out vec3 vMapNorm;



void main() {
  float count = 100.0;
  float idx = float(gl_InstanceID);
  float x = mod(idx, count);
  float y = floor(idx / count);
  float z = -20.0;



  vec2 size = vec2(1.0);

  //! POSITION
  vec3 pos = vec3(x, y, z);
  float viewPosDist = distance(uViewPos, pos);

  pos.xy *= size;
  pos.xy -= size*count*0.5;




  float t = uTime*1.0;


  //pos.xy += uMousePosPlane.xy*64.0;
  vec3 mapNorm = texture(tDraw, pos.xy/90.0+0.5).rgb;
  vMapNorm = mapNorm;

  pos.xyz -= mapNorm*10.0-5.0;
  pos += vec3(
    sin(t+idx),
    cos(t+idx),
    -sin(t+idx)
  );


  gl_PointSize = 10.0;
  vIsVisible = 1.0;




  //pos.y += h;
  //pos.y *= surface3(vec3(pos.xz*0.1+uTime*0.1, 0.0));



  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;




  vDistView = viewPosDist;
  vInstanceID = idx;
  vPos = pos;
}


