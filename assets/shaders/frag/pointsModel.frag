#include <chunk>



//uniform sampler2D tDraw;
uniform sampler2D tMask;
uniform sampler2D tMask2;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uViewPos;

struct Colors { 
  vec3 main;
  vec3 gray;
  vec3 light;
  vec3 white;
};
uniform Colors colors;



in float vInstanceID;
in vec3 vNormal;
in vec3 vPos;
in vec2 vUv;
in float vIsVisible;
in float vMixValue;
in float vIsNumber;
in float vRand;

vec4 color = vec4(vec3(1.0), 1.0);
vec4 color2 = vec4(vec3(0.0), 1.0);




void main() {

  vec2 tMaskSize = vec2(textureSize(tMask, 0));

  vec2 uv = gl_FragCoord.xy / tMaskSize.xy;
  vec2 uvP = gl_PointCoord.xy / tMaskSize.xy;

    


      if (vIsNumber != 1.0) {
        color.rgb = 1.2-vec3(distance(vPos, vec3(0.0)))*2.0;
        color.a = (1.0);
      } else {
        vec2 numUV = uvP*27.0-vec2(0.25, mod(vInstanceID, 2.0))/27.0;
        float v = texture(tMask, vec2(numUV.x, 1.0-numUV.y)).r;


        color.rgb = vec3(colors.main)
        *vec3(distance(vPos, vec3(0.0))+0.25)*2.0
        -(mod(vPos.y+uTime*0.5+vPos.z, 0.5))
        ;



        color.a = (1.0-v)*0.8;
      }




    //! 2
    //color.rgb += linearizeDepth(gl_FragCoord.z, 0.0005, 1.0);




  gl_FragColor = vec4(color.rgba);
}


// if (gl_FragCoord.x / uResolution.x < 0.5)