#define PI 3.1415926


//uniform sampler2D tNoise;

uniform float uTime;
uniform float uAspect;
uniform float uFrameCount;
uniform vec2 uMousePos;
uniform bvec3 uMouseButtons;



in vec2 vUv;

float rand (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

float cnoise(vec2 n) {
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

int vec3ToInt(vec3 color) {
  vec3 scaledColor = color * 255.0;
  vec3 roundedColor = round(scaledColor);
  int intValue = int(roundedColor.r) * 256 * 256 + int(roundedColor.g) * 256 + int(roundedColor.b);
  return intValue;
}

float sumVec3(vec3 vec) {
  return vec.x+vec.y+vec.z;
}


vec4 color = vec4(vec3(0.0), 1.0);
vec3 startColor = vec3(0.0);

void main() {

  //! MAPS ^ UV
  //vec2 tNoiseSize = vec2(textureSize(tNoise, 0));

  vec2 cord = gl_FragCoord.xy / 1.0;
  float t = uTime*0.01;

  color.rgba = vec4(
    surface3(vec3(cord*3.0+t, 0.0)),
    surface3(vec3(5.0+cord*3.0+t, 0.0)),
    surface3(vec3(10.0+cord*3.0+t, 0.0)),
    surface3(vec3(15.0-cord*3.0-t, 0.0))
  );


  gl_FragColor = vec4(color.rgba);
}