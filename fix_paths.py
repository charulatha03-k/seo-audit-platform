import os
import shutil

src_dir = "frontend/src"
os.makedirs(src_dir, exist_ok=True)

folders_to_move = ["app", "components", "services", "store", "hooks", "types", "utils"]

for folder in folders_to_move:
    src_path = f"frontend/{folder}"
    dest_path = f"frontend/src/{folder}"
    
    if os.path.exists(src_path):
        # If dest exists, move contents
        if os.path.exists(dest_path):
            for item in os.listdir(src_path):
                s = os.path.join(src_path, item)
                d = os.path.join(dest_path, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)
            shutil.rmtree(src_path)
        else:
            shutil.move(src_path, src_dir)

print("Moved custom folders into src/")
