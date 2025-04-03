import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useContestData } from "@/store/state"

export function Category() {

    const {category, setContestData} = useContestData()

    return (
        <div className="space-y-2">
          <Label className="text-black">Category</Label>
          <RadioGroup 
            value={category} 
            onValueChange={(value) => setContestData("category", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MALE" id="male" className="text-yellow-400 border-gray-300" />
              <Label htmlFor="male" className="text-black cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FEMALE" id="female" className="text-yellow-400 border-gray-300" />
              <Label htmlFor="female" className="text-black cursor-pointer">Female</Label>
            </div>
          </RadioGroup>
        </div>
    )
}