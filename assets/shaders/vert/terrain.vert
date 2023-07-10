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
  float idx = float(gl_InstanceID);

  //! POSITION
  vec3 pos = vec3(position);
  float viewPosDist = distance(uViewPos, pos);


  /*
  float t = uTime*0.1;
  pos.z += surface3(vec3(pos.xz*10.1+uTime*0.1, 0.0))*0.1;
*/


  //gl_PointSize *= uDPR;


  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;



  vDistView = viewPosDist;
  vInstanceID = idx;
  vPos = pos;
}