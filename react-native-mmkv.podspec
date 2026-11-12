require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-mmkv"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported, :tvos => "12.0", :osx => "10.14" }
  s.source       = { :git => "https://github.com/wekor/react-native-mmkv.git", :tag => "v#{s.version}" }

  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    "CLANG_CXX_LIBRARY" => "libc++",
    "CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF" => "NO",
    # FORCE_POSIX makes MMKV use C++ types instead of Objective-C types.
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FORCE_POSIX",
  }
  s.compiler_flags = "-x objective-c++"
  s.libraries    = "z", "c++"
  s.source_files = [
    "ios/**/*.{h,m,mm}",
    "cpp/**/*.{hpp,cpp,c,h}",
    "MMKV/Core/**/*.{h,cpp,hpp,S}",
  ]

  install_modules_dependencies(s)
end
