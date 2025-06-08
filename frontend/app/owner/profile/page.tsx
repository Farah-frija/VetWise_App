"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Edit, Save, Camera, Lock, Upload, X } from "lucide-react";
import { useAuth, useApiRequest } from "@/components/auth-provider";
import { useProfile } from "@/components/profile-profider";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function OwnerProfile() {
  const { user } = useAuth();
  const { request } = useApiRequest();
  const {
    profileImage,
    setProfileImage,
    nom,
    prenom,
    setUserNames,
    refreshProfile,
  } = useProfile(); // Use context for names too
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPasswordDialowOpen, setIsPasswordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load complete user profile data from API
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response: Response = await request(
        `/utilisateurs/profile/${user.id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setFormData({
          nom: userData.nom || "",
          prenom: userData.prenom || "",
          email: userData.email || "",
          telephone: userData.telephone || "",
          adresse: userData.adresse || "",
        });

        // Update context with names
        setUserNames(userData.nom || "", userData.prenom || "");

        if (userData.image) {
          setProfileImage(userData.image); // Update context
        } else {
          setProfileImage(null); // Update context
        }
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateResponse = await request(
        `/utilisateurs/update-profile/${user.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // Update context with new names immediately after successful API call
      setUserNames(formData.nom, formData.prenom);

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imageResponse = await request(
          `/utilisateurs/update-image/${user.id}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (imageResponse.ok) {
          await loadUserProfile();
          refreshProfile(); // Notify other components
          setImageFile(null);
          setImagePreview(null);
        } else {
          throw new Error("Failed to update profile image");
        }
      } else {
        // If no image update, just refresh to notify other components
        refreshProfile();
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await request("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordDialogOpen(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      alert(
        "Failed to change password. Please check your current password and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordInputChange = (
    field: keyof ChangePasswordData,
    value: string
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !formData.nom && !formData.prenom) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isLoading}
          className={isEditing ? "btn-primary" : "btn-secondary"}
        >
          {isLoading ? (
            <>Loading...</>
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="max-w-2xl">
        {/* Profile Picture Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload and manage your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {imagePreview || profileImage ? (
                    <img
                      src={imagePreview || profileImage || ""}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  {(imagePreview || imageFile) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">First Name</Label>
                {isEditing ? (
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) =>
                      handleInputChange("prenom", e.target.value)
                    }
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.prenom}</p>
                )}
              </div>
              <div>
                <Label htmlFor="nom">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.nom}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <p className="mt-1 text-gray-900">{formData.email}</p>
            </div>

            <div>
              <Label htmlFor="telephone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) =>
                    handleInputChange("telephone", e.target.value)
                  }
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {formData.telephone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="adresse">Address</Label>
              {isEditing ? (
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  rows={2}
                />
              ) : (
                <p className="mt-1 text-gray-900">
                  {formData.adresse || "Not provided"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-gray-600">
                  Update your account password
                </p>
              </div>
              <Dialog
                open={isPasswordDialowOpen}
                onOpenChange={setIsPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="currentPassword" className="col-span-4">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        className="col-span-4"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="newPassword" className="col-span-4">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "newPassword",
                            e.target.value
                          )
                        }
                        className="col-span-4"
                      />
                      <p className="text-sm text-gray-600 col-span-4">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirmPassword" className="col-span-4">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordInputChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="col-span-4"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} disabled={isLoading}>
                      {isLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
