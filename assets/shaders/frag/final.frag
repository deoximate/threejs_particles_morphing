#include <chunk>

uniform sampler2D tParticles;

uniform float uTime;
uniform float uAspect;
uniform float uFrameCount;
uniform vec2 uResolution;
uniform vec2 uSize;
uniform vec2 uMousePos;
uniform bvec3 uMouseButtons;

struct Colors { 
  vec3 main;
  vec3 gray;
  vec3 light;
  vec3 white;
};
uniform Colors colors;

in vec2 vUv;


vec4 color = vec4(vec3(0.0), 0.0);

void main() {

  //! MAPS ^ UV
  vec2 tParticlesSize = vec2(textureSize(tParticles, 0));

  vec2 tParticlesUV = gl_FragCoord.xy / tParticlesSize;


  //! MOUSE
  vec2 mousePos = uMousePos.xy * 0.5 + 0.5;

  float blurScale = distance(vUv-mousePos, vec2(0.0));


  vec3 colParticles;
  
  if (vUv.y < 0.52 && vUv.y > 0.2) {
    colParticles = blurBokeh(
      tParticles, vUv, uResolution, blurScale, 0.0
    );
  } else {
    colParticles = vec3(1.0);
  }



  color.rgb = (colParticles.rgb);


  gl_FragColor = vec4(color.rgb, 1.0);
}