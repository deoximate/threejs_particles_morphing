#include <chunk>


uniform float uTime;
uniform vec4 uMousePos;
uniform vec3 uViewPos;
uniform vec3 uModelAngle;
uniform float uDPI;
uniform float uDPR;

in vec3 position2;
in vec3 normal2;

out float vInstanceID;
out vec3 vNormal;
out vec3 vPos;
out vec2 vUv;
out float vIsVisible;
out float vMixValue;
out float vSinMixValue;
out float vIsNumber;
out float vRand;

void main() {
  float idx = float(gl_VertexID);


  //! POSITION
  float mixSpeed = 1.0;
  float mixSmooth = 0.75;
  //float stepN = uModelAngle.x*10.0;
  float stepN = (sin((0.0 - uTime * 0.5) * mixSpeed));
  float mixValue = smoothstep(-mixSmooth, mixSmooth, stepN);
  vec3 pos = mix(position, position2, mixValue);
  vec3 norm = mix(normal*normal2, normal*normal2, mixValue);

  vRand = rand(pos.xy);
  vIsVisible = 1.0;



  float dist = abs(distance(uViewPos, pos));

  
  if (pos.y <= uMousePos.y) {
    gl_PointSize = 5.0-dist*3.5;
    vIsNumber = 0.0;
  } else {
    gl_PointSize = 15.0-dist*3.5;
    vIsNumber = 1.0;
  }

  gl_PointSize = clamp(gl_PointSize, 1.0, 15.0);



  float s = (surface3(vec3(pos.xz/2.0+uTime*0.1, 0.0)));
  float s2 = (surface3(vec3(pos.xz*5.0-uTime*0.1, 0.0)));
  float distScale = 0.8 * 0.25;
  float distVel = uModelAngle.y * distScale;

  vec3 n = vec3(0.0);

  if (vIsNumber != 1.0) {
    n = tan(norm/(s*s2)) * distVel;
  } else {
    n = tan(norm*(s2)*1.2) * distVel * 2.0;
    n -= sin(norm/(s*s2)) * distVel * 1.0;
  }

  
  pos += (n);


  //! SCALE
  pos *= 0.9;
  pos *= 1.0-mixValue*0.2;
  pos.x *= 1.0+mixValue*0.1;

  //! HEART POS
  //pos.z = 0.4*mixValue;

  //! HEART
  if (pos.y < 0.2 && vIsNumber == 1.0)
  {
    float pulsScale = ((-abs(distVel)*10.0)*2.0+0.7)*0.5;
    pos *= 1.0 + 
    sin(uTime*10.0) *
    (distance(pos, vec3(0.0, 0.5, 0.0)) *
    abs(pos.x*pos.z+vec3(0.0, 0.05, 0.0))) *
    mixValue * pulsScale;
  }


  //pos.y += (1.0*distScale-abs(distVel)-distScale)*4.0+1.0*distScale;
  //pos.y += ((-abs(distVel)*10.0)*2.0+0.7);



/*
  if (gl_PointSize <= 1.0) {
    vIsVisible = 0.0;
  }
*/


  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, vIsVisible);
  gl_Position = projectionMatrix * modelViewPosition;



  vMixValue = mixValue;
  vSinMixValue = sin(mixValue*(PI));
  vInstanceID = idx;
  vNormal = norm;
  vPos = pos;
}


// if (pos.x < 0.0)