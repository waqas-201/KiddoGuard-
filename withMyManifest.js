const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withMyManifest(config) {
    return withAndroidManifest(config, (config) => {
        const mainApplication = config.modResults.manifest.application[0];
        const mainActivity = mainApplication.activity.find(
            (activity) => activity.$['android:name'] === '.MainActivity'
        );

        if (mainActivity) {
            // 1. ADD THE HOME LAUNCHER CATEGORIES
            // This makes your app a Home Screen / Launcher
            const mainFilter = mainActivity['intent-filter'].find((filter) =>
                filter.action.some((a) => a.$['android:name'] === 'android.intent.action.MAIN')
            );

            if (mainFilter) {
                const homeCategories = [
                    'android.intent.category.HOME',
                    'android.intent.category.DEFAULT'
                ];
                homeCategories.forEach((cat) => {
                    if (!mainFilter.category.some((c) => c.$['android:name'] === cat)) {
                        mainFilter.category.push({ $: { 'android:name': cat } });
                    }
                });
            }
        }

        // 2. ADD THE <QUERIES> BLOCK
        // Required for Android 11+ to "see" other apps or browsers
        config.modResults.manifest.queries = [
            {
                intent: [
                    {
                        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
                        category: [{ $: { 'android:name': 'android.intent.category.BROWSABLE' } }],
                        data: [{ $: { 'android:scheme': 'https' } }],
                    },
                ],
            },
        ];

        // 3. SET THE BACK INVOKED CALLBACK
        mainApplication.$['android:enableOnBackInvokedCallback'] = 'false';

        return config;
    });
};