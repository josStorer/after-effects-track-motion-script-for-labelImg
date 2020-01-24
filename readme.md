# About

This script uses track motion of After Effects to create XML files quickly for [labelImg](https://github.com/tzutalin/labelImg)

## How to use

### 1: Create a new composition > Put your video png sequence into the composition as a layer

### 2: Animation > Track motion

### 3: Tracker > Analyze forward

### 4: Keep doing step 3 and 4

### 5: File > Scripts > Run Script File > [This File]

## Notice

### The composition and png sequence layer must remain at the top, or you can change this script at line 22

### Set "Allow scripts to write file and access network" in preferences

### When you want the size of the tracker to change significantly, create a new tracker at the subsequent keyframe

### You can select and delete keyframes to remove unwanted information

### Observe during analyzing, if the target leaves the area, you can stop analyzing forward

### Keyframes of the first tracker must cover the whole timeline as a time check layer, and you can use empty tracking

### Set trackers' name as "tag:[Your Name]" to set the corresponding labelImg tag name
