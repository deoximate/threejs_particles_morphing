#include <chunk>


uniform sampler2D tDraw;
uniform sampler2D tBrain;
uniform sampler2D tParticles;
uniform sampler2D tMeteors;
uniform sampler2D tDepthDown;
uniform sampler2D tMask;

uniform float uTime;
uniform float uAspect;
uniform float uFrameCount;
uniform vec2 uResolution;
uniform vec2 uSize;
uniform vec2 uMousePos;
uniform vec2 uMousePosPlane;
uniform bvec3 uMouseButtons;


in vec2 vUv;


vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
vec3 startColor = vec3(0.0);

void main() {

  //! MAPS ^ UV
  vec2 tDrawSize = vec2(textureSize(tDraw, 0));
  vec2 tMaskSize = vec2(textureSize(tMask, 0));
  vec2 tBrainSize = vec2(textureSize(tMask, 0));
  vec2 tParticlesSize = vec2(textureSize(tMask, 0));

  vec2 tDrawUV = gl_FragCoord.xy / tDrawSize;
  vec2 tMaskUV = gl_FragCoord.xy / tMaskSize;
  vec2 tBrainUV = gl_FragCoord.xy / tBrainSize;
  vec2 tParticlesUV = gl_FragCoord.xy / tParticlesSize;


  //! MOUSE
  vec2 mousePos = uMousePosPlane.xy * 0.5 + 0.5;

  float blurScale = distance(vUv-mousePos, vec2(0.0))*1.0;
  vec3 colParticles = blurBokeh(
    tParticles, vUv, uResolution, blurScale, 0.0
  );
  /*vec3 colBrain = blurBokeh(
    tBrain, vUv, uResolution, blurScale*0.1, 0.0
  );*/

  //! COLORS
  vec4 col = texture(tDraw, vUv);
  vec4 colBrain = texture(tBrain, vUv);
  vec4 colMeteors = texture(tMeteors, vUv);
  //vec4 colParticles = texture(tParticles, vUv);




  color.rgb = col.rgb;

  if (uFrameCount <= 1.0) {
    color.rgb = vec3(0.0, 0.0, 0.0);
  }
  float dist = distance(tDrawUV, uMousePosPlane+0.5);


  if (dist < 0.15) {
    vec2 st = (tDrawUV-(uMousePosPlane+0.5));
    color.rg = (normalize(st)*0.5+0.5);
    color.b += 1.0;

  }
  color.rgb *= 0.99;
  color.rgb -= 0.003;
    







  gl_FragColor = vec4(color.rgb, 1.0);
}