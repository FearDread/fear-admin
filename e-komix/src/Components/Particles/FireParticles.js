import Particles from "react-particles";
import { Engine } from "tsparticles-engine";
import { loadFirePreset } from "tsparticles-preset-fire";

const ParticlesContainer = () => {
  // this customizes the component tsParticles installation
  const customInit(Engine) = async (Promise) {
    // this adds the preset to tsParticles, you can safely use the
    await loadFirePreset(Engine);
  }

  render() {
    const options = {
      preset: "fire",
    };

    return <Particles options={options} init={this.customInit} />;
  }
}