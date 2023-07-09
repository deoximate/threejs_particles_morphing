#include <chunk>



//uniform sampler2D tDraw;
uniform sampler2D tMask;

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


float fallerSpeed(float col, float faller) {
    return mod(cos(col * 363.435  + faller * 234.323), 0.1) * 1.0 + 0.3;
}

float matrix(vec2 uv) {
  vec2 CELLS = vec2(27.0*4.0, 27.0);
  float FALLERS = 14.0;
  float FALLERHEIGHT = 7.0;

  vec2 pix = mod(uv, 1.0/CELLS);
  vec2 cell = (uv - pix) * CELLS;
  pix *= CELLS * vec2(0.8, 1.0) + vec2(0.1, 0.0);

  float b = 0.0;
  for (float i = 0.0; i < FALLERS; ++i) {
    float f = 3.0 - cell.y * 0.05 -
    mod((uTime + i * 3534.34) * fallerSpeed(cell.x, i), FALLERHEIGHT);
    if (f > 0.0 && f < 1.0)
      b += f;
  }

  return b;
}



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
        -(mod(vPos.y+uTime*0.5+vPos.z, 0.5));



        color.a = (1.0-v)*0.8;
      }



    //! 1
    float zNear = 0.01;
    float zFar = 2.0; 
    float z = gl_FragCoord.z * 2.0 - 1.0;
    float linearDepth = (2.0 * zNear * zFar) / (zFar + zNear - z * (zFar - zNear));	
    //color.rgb -= linearDepth;

    //! 2
    //color.rgb += linearizeDepth(gl_FragCoord.z, 0.0005, 1.0);




  gl_FragColor = vec4(color.rgba);
}


// if (gl_FragCoord.x / uResolution.x < 0.5)