describe("network", function() {
    describe("layers", function() {
        var net;

        function checkLayer(expectedLayer, actualLayer) {
            expect(actualLayer.h).toEqual(expectedLayer.h);
            expect(actualLayer.w).toEqual(expectedLayer.w);
            expect(actualLayer.d).toEqual(expectedLayer.d);
            expect(actualLayer.weights).toEqual(expectedLayer.weights);
        }

        function checkNetwork(expectedLayers) {
            var actualLayers = net.getLayers();

            expect(actualLayers.length).toBe(expectedLayers.length);

            actualLayers.forEach(function (actualLayer, i) {
                checkLayer(expectedLayers[i], actualLayer)
            });
        }

        beforeEach(function () {
            net = buildNetwork();
        });

        it("linear classifier", function () {
            net.withInputLayer(100, 100, 1)
                .withOutputLayer(10);

            checkNetwork([
                {h: 100, w: 100, d: 1, weights: 0},
                {h: 1, w: 1, d: 10, weights: 100 * 100 * 10}
            ]);

        });

        it("conv net", function () {
            net.withInputLayer(128, 128, 3)
                .withConvLayer(3, 3, 1, 1, 1, 1, 6)
                .withRelu()
                .withPooling(2, 2, 2, 2)
                .withFullyConnectedLayer(32, 32, 6)
                .withOutputLayer(10);

            checkNetwork([
                {h: 128, w: 128, d: 3, weights: 0},
                {h: 128, w: 128, d: 6, weights: 3 * 3 * 3 * 6},
                {h: 128, w: 128, d: 6, weights: 0},
                {h: 64, w: 64, d: 6, weights: 0},
                {h: 32, w: 32, d: 6, weights: 64 * 64 * 6 * 32 * 32 * 6},
                {h: 1, w: 1, d: 10, weights: 32 * 32 * 6 * 10}
            ]);

            expect(net.getParameterCount()).toBe(3 * 3 * 3 * 6 + 64 * 64 * 6 * 32 * 32 * 6 + 32 * 32 * 6 * 10);
            expect(net.getMemoryRequirement()).toBe(((128 * 128 * 3) + (128 * 128 * 6) + (128 * 128 * 6) + (64 * 64 * 6) + (32 * 32 * 6) + 10) * 4);
        });
        it("VGGNet", function () {
            // validated against http://cs231n.github.io/convolutional-networks/#case
            net.withInputLayer(224, 224, 3)
                .withConvLayer(3, 3, 1, 1, 1, 1, 64)
                .withConvLayer(3, 3, 1, 1, 1, 1, 64)
                .withPooling(2, 2, 2, 2)
                .withConvLayer(3, 3, 1, 1, 1, 1, 128)
                .withConvLayer(3, 3, 1, 1, 1, 1, 128)
                .withPooling(2, 2, 2, 2)
                .withConvLayer(3, 3, 1, 1, 1, 1, 256)
                .withConvLayer(3, 3, 1, 1, 1, 1, 256)
                .withConvLayer(3, 3, 1, 1, 1, 1, 256)
                .withPooling(2, 2, 2, 2)
                .withConvLayer(3, 3, 1, 1, 1, 1, 512)
                .withConvLayer(3, 3, 1, 1, 1, 1, 512)
                .withConvLayer(3, 3, 1, 1, 1, 1, 512)
                .withPooling(2, 2, 2, 2)
                .withConvLayer(3, 3, 1, 1, 1, 1, 512)
                .withConvLayer(3, 3, 1, 1, 1, 1, 512)
                .withConvLayer(3, 3, 1, 1, 1, 1, 512)
                .withPooling(2, 2, 2, 2)
                .withFullyConnectedLayer(1, 1, 4096)
                .withFullyConnectedLayer(1, 1, 4096)
                .withOutputLayer(1000);

            checkNetwork([
                {h: 224, w: 224, d: 3, weights: 0},
                {h: 224, w: 224, d: 64, weights: (3 * 3 * 3) * 64},
                {h: 224, w: 224, d: 64, weights: (3 * 3 * 64) * 64},
                {h: 112, w: 112, d: 64, weights: 0},
                {h: 112, w: 112, d: 128, weights: (3 * 3 * 64) * 128},
                {h: 112, w: 112, d: 128, weights: (3 * 3 * 128) * 128},
                {h: 56, w: 56, d: 128, weights: 0},
                {h: 56, w: 56, d: 256, weights: (3 * 3 * 128) * 256},
                {h: 56, w: 56, d: 256, weights: (3 * 3 * 256) * 256},
                {h: 56, w: 56, d: 256, weights: (3 * 3 * 256) * 256},
                {h: 28, w: 28, d: 256, weights: 0},
                {h: 28, w: 28, d: 512, weights: (3 * 3 * 256) * 512},
                {h: 28, w: 28, d: 512, weights: (3 * 3 * 512) * 512},
                {h: 28, w: 28, d: 512, weights: (3 * 3 * 512) * 512},
                {h: 14, w: 14, d: 512, weights: 0},
                {h: 14, w: 14, d: 512, weights: (3 * 3 * 512) * 512},
                {h: 14, w: 14, d: 512, weights: (3 * 3 * 512) * 512},
                {h: 14, w: 14, d: 512, weights: (3 * 3 * 512) * 512},
                {h: 7, w: 7, d: 512, weights: 0},
                {h: 1, w: 1, d: 4096, weights: 7 * 7 * 512 * 4096},
                {h: 1, w: 1, d: 4096, weights: 4096 * 4096},
                {h: 1, w: 1, d: 1000, weights: 4096 * 1000}
            ]);

            expect(net.getParameterCount()).toBe(138344128);
            //expect(net.getMemoryRequirement()).toBe(60950432);

        });
    });

    describe("utils", function() {
        var utils = buildNetwork().utils;

        it("zero padding", function(){
            expect(utils.calcZeroPadding(10, 2, 1)).toBe(0);

            expect(utils.calcZeroPadding(10, 2, 2)).toBe(0);
            expect(utils.calcZeroPadding(11, 2, 2)).toBe(undefined);

            expect(utils.calcZeroPadding(8,  2, 3)).toBe(0);
            expect(utils.calcZeroPadding(9,  2, 3)).toBe(1);
            expect(utils.calcZeroPadding(10, 2, 3)).toBe(2);
            expect(utils.calcZeroPadding(11, 2, 3)).toBe(0);

            expect(utils.calcZeroPadding(6,  2, 4)).toBe(0);
            expect(utils.calcZeroPadding(7,  2, 4)).toBe(undefined);
            expect(utils.calcZeroPadding(8,  2, 4)).toBe(1);
            expect(utils.calcZeroPadding(9,  2, 4)).toBe(undefined);
            expect(utils.calcZeroPadding(10, 2, 4)).toBe(0);

            expect(utils.calcZeroPadding(7,  2, 5)).toBe(0);
            expect(utils.calcZeroPadding(8,  2, 5)).toBe(2);
            expect(utils.calcZeroPadding(9,  2, 5)).toBe(4);
            expect(utils.calcZeroPadding(10, 2, 5)).toBe(1);
            expect(utils.calcZeroPadding(11, 2, 5)).toBe(3);
            expect(utils.calcZeroPadding(12, 2, 5)).toBe(0);

            expect(utils.calcZeroPadding(9,  3, 6)).toBe(0);
            expect(utils.calcZeroPadding(10, 3, 6)).toBe(undefined);
            expect(utils.calcZeroPadding(11, 3, 6)).toBe(2);
            expect(utils.calcZeroPadding(12, 3, 6)).toBe(undefined);
            expect(utils.calcZeroPadding(13, 3, 6)).toBe(1);
            expect(utils.calcZeroPadding(14, 3, 6)).toBe(undefined);
            expect(utils.calcZeroPadding(15, 3, 6)).toBe(0);

            expect(utils.calcZeroPadding(8,  1, 7)).toBe(0);
            expect(utils.calcZeroPadding(9,  1, 7)).toBe(3);
            expect(utils.calcZeroPadding(10, 1, 7)).toBe(6);
            expect(utils.calcZeroPadding(11, 1, 7)).toBe(2);
            expect(utils.calcZeroPadding(12, 1, 7)).toBe(5);
            expect(utils.calcZeroPadding(13, 1, 7)).toBe(1);
            expect(utils.calcZeroPadding(14, 1, 7)).toBe(4);
            expect(utils.calcZeroPadding(15, 1, 7)).toBe(0);
        });
    });
});