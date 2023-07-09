#define PI 3.14159265359
#define PI2 6.28318530718

#define CELLS vec2(27.0*2.0, 27.0)
#define FALLERS 14.0
#define FALLERHEIGHT 7.0

//uniform sampler2D tDraw;
uniform sampler2D tMask;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uViewPos;



vec4 color = vec4(vec3(0.0), 1.0);

float rand (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

float cnoise (vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float surface3 ( vec3 coord ) {
        float frequency = 4.0;
        float n = 0.0;  
        n += 1.0    * abs( cnoise( vec2(coord * frequency) ) );
        n += 0.5    * abs( cnoise( vec2(coord * frequency * 2.0) ) );
        n += 0.25   * abs( cnoise( vec2(coord * frequency * 4.0) ) );
        return n;
}

float fallerSpeed(float col, float faller) {
    return mod(cos(col * 363.435  + faller * 234.323), 0.1) * 1.0 + 0.3;
}

void main() {

  vec2 tMaskSize = vec2(textureSize(tMask, 0));

  vec2 uv = gl_FragCoord.xy / tMaskSize.xy;



      float r = rand(vec2(floor(uv.x*27.0*2.0), 0.0))*0.2+0.1;
      float offsetY = uTime*r;

      float v = texture(tMask, uv*2.0+vec2(0.0, uTime*0.5)).r*0.3+0.7;

      color.rgb = vec3(v-1.0, v-1.0, v-1.0)+1.0;
      //color.rgb = vec3(1.0, 1.0, 1.0+v)-v;
      color.a = 1.0;
/*
      float y = floor(uTime+uv.y*4.0);
      float x = floor(uv.x*27.0*2.0);
      color.a = mod(x + y, 2.0);
*/

/*

    vec2 pix = mod(uv, 1.0/CELLS);
    vec2 cell = (uv - pix) * CELLS;
    pix *= CELLS * vec2(0.8, 1.0) + vec2(0.1, 0.0);

    float c = texture(tMask, (rand(cell) + pix) / 16.0).x;
    
    float b = 0.0;
    for (float i = 0.0; i < FALLERS; ++i) {
        float f = 3.0 - cell.y * 0.05 -
            mod((uTime + i * 3534.34) * fallerSpeed(cell.x, i), FALLERHEIGHT);
        if (f > 0.0 && f < 1.0)
            b += f;
    }

    color.a = 1.0-c/b;

*/


  gl_FragColor = vec4(color.rgba);
}