"use client";

import MapReturnButton from "@/components/buttons/map-return-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const SettingsPage = () => {
  // TODO load from user setting from db
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    // TODO
    alert("Settings saved!");
  };

  return (
    <div className="container">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to your settings page. Here you can change how the app look.
        </p>
        <Card className="my-2">
          <CardContent className="py-2 px-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between py-2">
          <MapReturnButton title="Return" />

          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default SettingsPage;
