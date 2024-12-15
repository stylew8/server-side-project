namespace backend.Infrastructure.Helpers;

public class Helpers
{
    public static Guid? StringToGuidDef(string str)
    {
        Guid value;
        if (Guid.TryParse(str, out value))
            return value;
        return null;
    }

    public static int? StringToIntDef(string str, int? def)
    {
        int value;
        if (int.TryParse(str, out value))
            return value;
        return def;
    }
}