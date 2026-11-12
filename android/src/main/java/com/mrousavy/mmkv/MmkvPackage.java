package com.mrousavy.mmkv;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class MmkvPackage extends BaseReactPackage {
  @Nullable
  @Override
  public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
    if (name.equals(MmkvPlatformContextModule.NAME)) {
      return new MmkvPlatformContextModule(reactContext);
    }
    return null;
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      moduleInfos.put(
          MmkvPlatformContextModule.NAME,
          new ReactModuleInfo(
              MmkvPlatformContextModule.NAME,
              MmkvPlatformContextModule.class.getName(),
              false, // canOverrideExistingModule
              false, // needsEagerInit
              false, // isCxxModule
              true // isTurboModule
          ));
      return moduleInfos;
    };
  }
}
