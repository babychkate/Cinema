using System.Runtime.Serialization;

namespace Cinema.Enums
{
    public enum ForWhatType
    {
        [EnumMember(Value = "Snack")]
        Snack,

        [EnumMember(Value = "Ticket")]
        Ticket,

        [EnumMember(Value = "Both")]
        Both
    }
}
