#include <chunk>

uniform sampler2D tDraw;


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


out vec3 vColor;

void main() {
  float count = 150.0;
  float idx = float(gl_InstanceID);
  float x = mod(idx, count);
  float z = floor(idx / count);
  float y = mod(idx, 2.0);



  vec2 size = vec2(0.01)*(100.0/count)*4.0;

  //! POSITION
  vec3 pos = vec3(x, z, 0.0);
  float viewPosDist = distance(uViewPos, pos);


  pos.xy *= size;
  pos.xy -= size*count*0.5;


  //! MAPS
  vec3 normal = texture(tDraw, pos.xy/4.0+0.5).rgb;
  vColor = normal;



  pos.xyz += (normal);
  //pos.y -= tan(normal.b);


  gl_PointSize = 14.0;


  if (gl_PointSize <= 5.0) {
    gl_PointSize = 5.0;
  }



  float t = uTime*0.1;




  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;



  vIsVisible = 1.0;
  vDistView = viewPosDist;
  vInstanceID = idx;
  vPos = pos;
}


