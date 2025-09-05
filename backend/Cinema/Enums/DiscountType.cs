using System.Runtime.Serialization;

namespace Cinema.Enums
{
    public enum DiscountType
    {
        [EnumMember(Value = "Student")]
        Student,   

        [EnumMember(Value = "Purchase4")]
        Purchases4, 

        [EnumMember(Value = "SummerForKids")]
        SummerForKids, 

        [EnumMember(Value = "ShowDateDiscount")]
        ShowDateDiscount, 

        [EnumMember(Value = "Reviews100Plus")]
        Reviews100Plus, 
    }
}
