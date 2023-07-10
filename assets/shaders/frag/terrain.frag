#include <chunk>




uniform sampler2D tMask;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uViewPos;
uniform vec4 uMousePos;

struct Colors { 
  vec3 main;
  vec3 gray;
  vec3 light;
  vec3 white;
};
uniform Colors colors;



in float vInstanceID;
in vec3 vPos;
in float vDepth;
in vec3 vNormal;
in float vIsDrop;
in float vIsVisible;



vec4 color = vec4(vec3(0.2), 1.0);

void main() {

  vec2 tMaskSize = vec2(textureSize(tMask, 0));
  vec2 uvS = gl_FragCoord.xy / tMaskSize.xy;
  vec2 uvP = gl_PointCoord.xy / tMaskSize.xy;
  uvP.y = 1.0-uvP.y;
/*
  float r = rand(vec2(floor((uvS.x*27.0*2.0)), 0.0))*0.2+0.1;
  float offsetY = uTime*r;

  float v = texture(tMask, uvP*27.0-vec2(0.25, -0.1-mod(vInstanceID, 2.0))/27.0).r;
*/
  color.rgb = mix(vec3(0.0), vec3(colors.main), 1.0-uMousePos.y*2.0);
  color.a = 1.0-distance(vec3(0.0), vPos)*0.5;




  gl_FragColor = vec4(color);
}