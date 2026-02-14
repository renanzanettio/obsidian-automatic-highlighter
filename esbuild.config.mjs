import esbuild from 'esbuild';

const isDev = process.argv.includes('--watch');

const buildOptions = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'main.js',
    format: 'cjs',
    platform: 'node',
    external: ['obsidian'],
    sourcemap: true,
};

if (isDev) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
} else {
    await esbuild.build(buildOptions);
}